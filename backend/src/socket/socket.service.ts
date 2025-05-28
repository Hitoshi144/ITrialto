// src/socket/socket.service.ts
import { BadRequestException, forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { NotificationsService } from 'src/notifications/notifications.service';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    // другие поля из JWT при необходимости
  };
}

@WebSocketGateway({
  namespace: '/ws', // Пространство имён
  path: '/ws/socket.io', // Должен совпадать с клиентом
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:9000',
    credentials: true,
  },
  transports: ['websocket'], // Только WebSocket (без HTTP polling)
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(SocketService.name);
  private readonly clients = new Map<number, Socket>();

  private static instance: SocketService;

  public static getInstance(): SocketService {
    return SocketService.instance;
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new Error('No token');
  
      const payload = await this.jwtService.verifyAsync(token);
      client.user = payload;
  
      const userId = payload.id ?? payload.sub;
      if (!userId) throw new Error('User ID not found in JWT');
  
      this.clients.set(userId, client);
  
      client.emit('connection_success', { userId });
  
      client.on('disconnect', () => {
        this.clients.delete(userId);
      });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.emit('connection_error', { error: error.message });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.user?.id;
    if (userId) {
      this.clients.delete(userId);
    }
  }

  /**
   * Отправка сообщения конкретному пользователю
   * @param userId ID пользователя
   * @param event Название события
   * @param data Данные для отправки
   */
  public sendToUser(userId: number, event: string, data: any): boolean {
    const client = this.clients.get(userId);
    
    if (!client || client.disconnected) {
      this.logger.warn(`User ${userId} not connected`);
      return false;
    }

    try {
      client.emit(event, data);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send to user ${userId}: ${error.message}`);
      return false;
    }
}

  /**
   * Широковещательная рассылка всем подключенным клиентам
   * @param event Название события
   * @param data Данные для отправки
   */
  public broadcast(event: string, data: any): void {
    this.server.emit(event, data);
  }

  // Пример защищенного метода, требующего аутентификации
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: AuthenticatedSocket, payload: any) {
    const userId = client.user!.id;
    this.logger.log(`Private message from user ${userId}: ${JSON.stringify(payload)}`);
    
    // Можно добавить логику обработки сообщения
    return { 
      status: 'received',
      userId,
      timestamp: new Date().toISOString()
    };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('teamJoinRequest')
  async handleTeamJoinRequest(client: AuthenticatedSocket, payload: { teamId: number, targetUserId: number }) {
    const userId = client.user?.id
    this.logger.log(`User ${userId} requests to join team ${payload.teamId}, notifying user ${payload.targetUserId}`)

    const notification = await this.notificationService.create({
      type: 'teamJoinRequest',
      message: `Пользователь ${userId} хочет присоедениться к команде ${payload.teamId}`,
      fromUserId: userId,
      toUserId: payload.targetUserId,
      teamId: payload.teamId,
      isRead: false,
      timestamp: new Date()
    })

    if (!notification) {
      throw new BadRequestException('Ошибка создания уведомления')
    }

    this.sendToUser(payload.targetUserId, 'newTeamJoinRequest', {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      teamId: notification.teamId,
      team: notification.team,
      fromUserId: notification.fromUserId,
      fromUser: notification.fromUser,
      toUserId: notification.toUserId,
      toUser: notification.toUser,
      projectId: notification.projectId,
      project: notification.project,
      timestamp: notification.timestamp.toISOString()
    })

    return {
      status: 'requestSent',
      timestamp: new Date().toISOString()
    }
  }
}
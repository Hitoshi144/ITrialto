// src/socket/socket.service.ts
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    // другие поля из JWT при необходимости
  };
}

@WebSocketGateway({
  namespace: '/ws', // опциональное пространство имен
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:9000',
    credentials: true,
  },
  transports: ['websocket'], // используем только WebSocket (без polling)
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(SocketService.name);
  private readonly clients = new Map<number, AuthenticatedSocket>();

  @UseGuards(WsJwtGuard)
  async handleConnection(client: AuthenticatedSocket) {
    try {
      if (!client.user?.id) {
        throw new Error('User ID not found in JWT');
      }

      const userId = client.user.id;
      this.clients.set(userId, client);
      this.logger.log(`User ${userId} connected`);

      // Отправляем подтверждение подключения
      client.emit('connectionSuccess', { 
        status: 'connected',
        userId,
        timestamp: new Date().toISOString()
      });

      // Обработка ошибок для конкретного клиента
      client.on('error', (err) => {
        this.logger.error(`Client error (user ${userId}): ${err.message}`);
      });

    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.emit('connectionError', { 
        error: 'Authentication failed',
        message: error.message
      });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.user?.id;
    if (userId) {
      this.clients.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
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
    if (!client) {
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
}
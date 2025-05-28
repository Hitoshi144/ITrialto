import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class NotificationsService {
  constructor (
    @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly socketService: SocketService
  ) {}

  async create (notificationData: Partial<Notification>) {
    const notification = this.notificationRepository.create(notificationData)

    if (notification.teamId) {
      const team = await this.teamRepository.findOneBy({id: notification.teamId})
      
      if (!team) {
        throw new BadRequestException('Команда не найдена')
      }

      notification.team = team
    }

    if (notification.projectId) {
      const project = await this.projectRepository.findOneBy({id: notification.projectId})

      if (!project) {
        throw new BadRequestException('Проект не найден')
      }

      notification.project = project
    }
    
    const fromUser = await this.userRepository.findOneBy({id: notification.fromUserId})

    if (!fromUser) {
      throw new BadRequestException('Пользователь с id ' + notification.fromUserId + ' не найден.')
    }

    notification.fromUser = fromUser

    const toUser = await this.userRepository.findOneBy({id: notification.toUserId})

    if (!toUser) {
      throw new BadRequestException(`Пользователь с id ${notification.toUserId} не найден.`)
    }

    notification.toUser = toUser

    const saved = await this.notificationRepository.save(notification)

    return await this.notificationRepository.findOne({
      where: {id: saved.id},
      relations: ['fromUser', 'toUser', 'team', 'project']
    })
  }

  async findAllForUser (userId: number) {
    return await this.notificationRepository.find({
      where: {toUserId: userId},
      order: {timestamp: 'DESC'},
      relations: ['fromUser', 'team', 'project']
    })
  }

  async markAsRead (notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({id: notificationId})

    if (!notification) {
      throw new BadRequestException('Уведомление не найден')
    }

    notification.isRead = true

    return await this.notificationRepository.save(notification)
  }

  async markAllAsRead (userId: number) {
    await this.notificationRepository.update({toUserId: userId}, {isRead: true})
  }

  async createAndNotify(params: {
    type: Notification['type'];
    message: string;
    fromUserId: number;
    toUserId: number;
    teamId?: number;
    projectId?: number;
  }): Promise<Notification> {
    try {
    const notification = await this.create({
      ...params,
      isRead: false,
      timestamp: new Date()
    });

    if (!notification) {
      throw new BadRequestException('Ошибка создания уведомления')
    }
  
    // Отправка через WebSocket
    try {
      const isDelivered = this.socketService.sendToUser(params.toUserId, 'newTeamJoinRequest', {
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
        timestamp: notification.timestamp.toISOString(),
        isRead: notification.isRead
      });

      if (!isDelivered) {
        console.warn(`User ${params.toUserId} is not currently connected via WebSocket`);
      }
    } catch (socketError) {
      console.error(`WebSocket delivery error: ${socketError.message}`);
    }
  
    return notification;
  }
  catch (error) {
    console.error(`Notification creation failed: ${error.message}`);
    throw new BadRequestException('Failed to create notification');
  }
}
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async createPrivateChat(user1Id: number, user2Id: number): Promise<Chat> {
    try {
      const user1 = await this.userRepository.findOne({
        where: {id: user1Id}
      })
      const user2 = await this.userRepository.findOne({
        where: {id: user2Id}
      })

      if (!user1 || !user2) {
        throw new NotFoundException('User1 or User2 not found')
      }

      const existingChat = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'user', 'user.id IN (:...userIds)', {
        userIds: [user1Id, user2Id],
      })
      .groupBy('chat.id')
      .having('COUNT(DISTINCT user.id) = 2')
      .andWhere('chat.isGroup = false')
      .getOne();

      if (existingChat) {
        return existingChat
      }

      const chat = this.chatRepository.create({
        isGroup: false,
        participants: [user1, user2],
        createdBy: user1
      })

      return await this.chatRepository.save(chat)
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async createGroupChat(creatorId: number, name: string, userIds: number[]): Promise<Chat> {
    try {
      const creator = await this.userRepository.findOne({
        where: {id: creatorId}
      })

      if (!creator) {
        throw new NotFoundException('Creator not found')
      }

      const users: User[] = []

      await Promise.all(
        userIds.map(async userId => {
          const user = await this.userService.getUser(userId)

          if (!user) {
            throw new NotFoundException(`user with id ${userId} not found`)
          }

          users.push(user)
        })
      )

      const chat = this.chatRepository.create({
        name,
        isGroup: true,
        participants: [creator, ...users],
        createdBy: creator
      })

      return await this.chatRepository.save(chat)
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async addParticipants(chatId: number, userIds: number[]): Promise<Chat> {
    try {
      const chat = await this.chatRepository.findOne({
        where: {id: chatId},
        relations: ['participants']
      })

      if (!chat) {
        throw new NotFoundException('chat not found')
      }

      if (!chat.isGroup) {
        throw new BadRequestException('Cannot add participants to private chat')
      }

      const users: User[] = []

      await Promise.all(
        userIds.map(async userId => {
          const user  = await this.userService.getUser(userId)

          if (!user) {
            throw new NotFoundException(`user with id ${userId} not found`)
          }

          users.push(user)
        })
      )

      const newParticipants = users.filter(user => !chat.participants.some(p => p.id === user.id))

      chat.participants = [...chat.participants, ...newParticipants]

      return await this.chatRepository.save(chat)
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async removeParticipants(chatId: number, userIds: number[]): Promise<Chat> {
    try {
      const chat = await this.chatRepository.findOne({
        where: {id: chatId},
        relations: ['participants'],
      })

      if (!chat) {
        throw new NotFoundException('chat not found')
      }

      if (!chat.isGroup) {
        throw new BadRequestException('Cannot remove participants from private chat')
      }

      chat.participants = chat.participants.filter(user => !userIds.includes(user.id))

      return await this.chatRepository.save(chat)
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async updateChatName(chatId: number, name: string): Promise<Chat> {
    try {
      const chat = await this.chatRepository.findOne({ where: { id: chatId } });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (!chat.isGroup) {
      throw new Error('Cannot rename private chat');
    }

    chat.name = name;
    return await this.chatRepository.save(chat);
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async getChatById(chatId: number): Promise<Chat> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: ['participants', 'messages', 'messages.sender'],
      });
  
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
  
      return chat;
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async getUserChats(userId: number): Promise<Chat[]> {
    try {
      return this.chatRepository
    .createQueryBuilder('chat')
    .innerJoin('chat.participants', 'user', 'user.id = :userId', { userId })
    .leftJoinAndSelect('chat.participants', 'participants')
    .leftJoinAndSelect('chat.messages', 'messages')
    .orderBy('messages.createdAt', 'DESC') // Опционально: сортировка по последнему сообщению
    .getMany();
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async sendMessage(chatId: number, senderId: number, content: string): Promise<Message> {
    try {
      const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    const sender = await this.userRepository.findOne({ where: { id: senderId } });

    if (!chat || !sender) {
      throw new NotFoundException('Chat or sender not found');
    }

    // Проверяем, является ли отправитель участником чата
    const isParticipant = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.participants', 'user', 'user.id = :userId', { userId: senderId })
      .where('chat.id = :chatId', { chatId })
      .getCount();

    if (!isParticipant) {
      throw new Error('Sender is not a participant of this chat');
    }

    const message = this.messageRepository.create({
      content,
      sender,
      chat,
    });

    return await this.messageRepository.save(message);
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: ['messages', 'messages.sender'],
      });
  
      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
  
      return chat.messages;
    }
    catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async deleteChat(chatId: number, userId: number): Promise<void> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['createdBy'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.createdBy.id !== userId) {
      throw new Error('Only chat creator can delete the chat');
    }

    await this.chatRepository.remove(chat);
  }

  async markMessagesAsRead(chatId: number, userId: number): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('chatId = :chatId AND senderId != :userId', { chatId, userId })
      .execute();
  }

  async getUnreadMessagesCount(userId: number): Promise<{ [chatId: number]: number }> {
    const result = await this.messageRepository
      .createQueryBuilder('message')
      .select('message.chatId', 'chatId')
      .addSelect('COUNT(message.id)', 'count')
      .innerJoin('message.chat', 'chat')
      .innerJoin('chat.participants', 'user', 'user.id = :userId', { userId })
      .where('message.isRead = false AND message.senderId != :userId', { userId })
      .groupBy('message.chatId')
      .getRawMany();
  
    return result.reduce((acc, { chatId, count }) => {
      acc[chatId] = parseInt(count, 10);
      return acc;
    }, {});
  }
}

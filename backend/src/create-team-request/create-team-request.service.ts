import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreateTeamRequestDto } from './dto/create-create-team-request.dto';
import { UpdateCreateTeamRequestDto } from './dto/update-create-team-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamRequest } from './entities/create-team-request.entity';

@Injectable()
export class CreateTeamRequestService {
  constructor(
    @InjectRepository(CreateTeamRequest)
    private readonly requestRepository: Repository<CreateTeamRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly teamsService: TeamsService,
  ) {}

  async createRequest(userId: number, title: string, description: string = '') {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const request = this.requestRepository.create({
      title,
      description,
      creatorId: userId,
      status: 'pending',
    });

    return await this.requestRepository.save(request);
  }

  async approveRequest(requestId: number, adminId: number) {
    const request = await this.requestRepository.findOne({ 
      where: { id: requestId },
      relations: ['creator']
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    // Здесь должна быть проверка прав adminId
    
    request.status = 'approved';
    await this.requestRepository.save(request);

    // Создаем команду
    return await this.teamsService.create({
      title: request.title,
      description: request.description,
      teamLeaderId: request.creatorId,
    });
  }

  async rejectRequest(requestId: number, adminId: number) {
    const request = await this.requestRepository.findOne({ 
      where: { id: requestId }
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    // Здесь должна быть проверка прав adminId
    
    request.status = 'rejected';
    return await this.requestRepository.save(request);
  }

  async getUserRequests(userId: number) {
    return await this.requestRepository.find({ 
      where: { creatorId: userId, status: 'pending' },
      order: { createdAt: 'DESC' }
    });
  }

  async getAllPendingRequests() {
    return await this.requestRepository.find({ 
      where: { status: 'pending' },
      relations: ['creator'],
      order: { createdAt: 'DESC' }
    });
  }

  async deleteRequest(id: number) {
    return await this.requestRepository.delete(id)
  }
}

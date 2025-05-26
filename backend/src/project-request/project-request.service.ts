import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Repository } from 'typeorm';
import { ProjectRequest } from './entities/project-request.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProjectRequestService {
  constructor(
    @InjectRepository(ProjectRequest)
    private readonly projectRequestRepository: Repository<ProjectRequest>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRequest(projectId: number, teamId: number, userId: number) {
    // 1. Проверяем, что пользователь является лидером указанной команды
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'leaderOfTeams']
    });
  
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
  
    if (!user.leaderOfTeams?.includes(teamId)) {
      throw new BadRequestException('Вы не являетесь лидером указанной команды');
    }
  
    // 2. Проверяем существование команды
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['currentProject']
    });
  
    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }
  
    // 3. Проверяем, что команда не занята другим проектом
    if (team.currentProject) {
      throw new BadRequestException('Команда уже работает над другим проектом');
    }
  
    // 4. Проверяем существование проекта
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['team']
    });
  
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
  
    // 5. Проверяем, что проект доступен для взятия
    if (project.team) {
      throw new BadRequestException('Проект уже назначен другой команде');
    }
  
    if (project.status !== 'published') {
      throw new BadRequestException('Нельзя подать заявку на этот проект');
    }
  
    // 6. Проверяем, нет ли уже активной заявки
    const existingRequest = await this.projectRequestRepository.findOne({
      where: {
        teamId,
        projectId,
        status: 'pending'
      }
    });
  
    if (existingRequest) {
      throw new BadRequestException('Заявка уже существует');
    }
  
    // 7. Создаем новую заявку
    const request = this.projectRequestRepository.create({
      teamId,
      projectId,
      status: 'pending'
    });
  
    return await this.projectRequestRepository.save(request);
  }

  async approveRequest(requestId: number) {
    const request = await this.projectRequestRepository.findOne({ 
      where: { id: requestId },
      relations: ['team', 'project']
    });
    
    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Заявка уже обработана');
    }

    if (request.project.teamId) {
      throw new BadRequestException('Проект уже назначен другой команде');
    }

    // Отклоняем все другие заявки на этот проект
    await this.projectRequestRepository.update(
      { projectId: request.projectId, status: 'pending' },
      { status: 'rejected' }
    );

    // Назначаем команду на проект
    request.project.teamId = request.teamId;
    request.project.status = 'in_progress';
    request.project.recruitment = 'close'
    request.team.currentProjectId = request.projectId;
    
    await this.projectRepository.save(request.project);
    await this.teamRepository.save(request.team);

    request.status = 'approved';
    return await this.projectRequestRepository.save(request);
  }

  async rejectRequest(requestId: number) {
    const request = await this.projectRequestRepository.findOne({ 
      where: { id: requestId }
    });
    
    if (!request) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Заявка уже обработана');
    }

    request.status = 'rejected';
    return await this.projectRequestRepository.save(request);
  }

  async getTeamRequests(teamId: number) {
    return await this.projectRequestRepository.find({ 
      where: { teamId },
      relations: ['project'],
      order: { createdAt: 'DESC' }
    });
  }

  async getProjectRequests(projectId: number) {
    return await this.projectRequestRepository.find({ 
      where: { projectId, status: 'pending' },
      relations: ['team'],
      order: { createdAt: 'DESC' }
    });
  }

  async deleteToProjectRequest(requestId: number) {
    try {
      const request = await this.projectRequestRepository.findOne({where: {id: requestId}})

      if (!request) {
        throw new BadRequestException('Заявка не найдена')
      }

      return await this.projectRequestRepository.remove(request)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

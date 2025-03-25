import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async createProject(createProjectDto: {
    title: string;
    problem: string;
    solution: string;
    expectedResult: string;
    stack: string;
    customer?: string;
    userId: number;
  }) {
    const user = await this.userRepository.findOne({ where: { id: createProjectDto.userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      status: 'pending',
    });

    return await this.projectRepository.save(project);
  }

  async updateProjectStatus(id: number, status: 'published' | 'revision' | 'rejected', comment?: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    project.status = status;
    if (comment) {
      project.comment = comment;
    }

    return await this.projectRepository.save(project);
  }

  async assignTeamToProject(projectId: number, teamId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Команда не найдена');
    }

    project.teamId = teamId;
    project.status = 'in_progress';

    return await this.projectRepository.save(project);
  }

  async getUserProjects(userId: number) {
    return await this.projectRepository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async getAllProjects(status?: 'pending' | 'published' | 'in_progress' | 'revision') {
    const where = status ? { status } : {};
    return await this.projectRepository.find({ 
      where,
      relations: ['user', 'team'],
      order: { createdAt: 'DESC' }
    });
  }

  async getProjectDetails(id: number) {
    const project = await this.projectRepository.findOne({ 
      where: { id },
      relations: ['user', 'team'] 
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
    return project;
  }

  async completeProject(projectId: number) {
    const project = await this.projectRepository.findOne({ 
      where: { id: projectId },
      relations: ['team']
    });
    
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    if (project.status !== 'in_progress') {
      throw new BadRequestException('Только проекты в работе могут быть завершены');
    }

    // Убираем проект у команды
    if (project.team) {
      project.team.currentProjectId = null;
      await this.teamRepository.save(project.team);
    }

    project.status = 'completed';
    project.teamId = null;
    return await this.projectRepository.save(project);
  }

  async resubmitProject(projectId: number, userId: number, updateData: {
    title?: string;
    problem?: string;
    solution?: string;
    expectedResult?: string;
    stack?: string;
    customer?: string;
  }) {
    const project = await this.projectRepository.findOne({ 
      where: { id: projectId, userId }
    });
    
    if (!project) {
      throw new NotFoundException('Проект не найден или у вас нет прав');
    }

    if (project.status !== 'revision') {
      throw new BadRequestException('Только проекты на доработке могут быть отправлены повторно');
    }

    Object.assign(project, updateData);
    project.status = 'pending';
    project.comment = null;
    return await this.projectRepository.save(project);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Team } from 'src/teams/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Rialto } from 'src/rialto/entities/rialto.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Rialto)
    private readonly rialtoRepository: Repository<Rialto>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createProject(createProjectDto: {
    title: string;
    problem: string;
    solution: string;
    expectedResult: string;
    stack: string[];
    customer?: string;
    userId: number;
    rialtoId: number
  }) {
    const user = await this.userRepository.findOne({ where: { id: createProjectDto.userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const rialto = await this.rialtoRepository.findOne({where: {id: createProjectDto.rialtoId}})
    
    if (!rialto) {
      throw new BadRequestException('Биржа не найдена')
    }

    const pgArray = `{${createProjectDto.stack.join(",")}}`;
    
    const project = this.projectRepository.create({
      ...createProjectDto,
      stack: pgArray,
      status: 'pending',
    });

    await this.projectRepository.save(project);

    return project
  }

  async updateProjectStatus(id: number, status: 'published' | 'revision' | 'rejected', fromUser: number, comment?: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }

    project.status = status;
    if (comment) {
      project.comment = comment;
    }


    if (status === 'published') {
      project.recruitment = 'open'

      await this.notificationsService.createAndNotify({
        type: 'publishedProject',
        message: `Ваш проект ${project.title} опубликован.`,
        fromUserId: fromUser,
        toUserId: project.userId,
        projectId: project.id
      })
    }
    else if (status === 'revision') {
      await this.notificationsService.createAndNotify({
        type: 'revisionProject',
        message: `Ваш проект ${project.title} отправлен на доработку.`,
        fromUserId: fromUser,
        toUserId: project.userId,
        projectId: project.id
      })
    }
    else if (status === 'rejected') {
      await this.notificationsService.createAndNotify({
        type: 'rejectedProject',
        message: `Ваш проект ${project.title} отклонен.`,
        fromUserId: fromUser,
        toUserId: project.userId,
        projectId: project.id
      })
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

  async resignTeamToProject(projectId: number) {
    const project = await this.projectRepository.findOne({where: {id: projectId}})
    let team

    if (!project) {
      throw new BadRequestException('Проект не найден')
    }
    
    if (project.teamId) {
      team = await this.teamRepository.findOne({where: {id: project.teamId}})
    }
    else {
      throw new BadRequestException('Нет команды, работающей над проектом')
    }

    if (!team) {
      throw new BadRequestException('Команда не найдена')
    }

    team.currentProjectId = null;
    await this.teamRepository.save(team);

    project.teamId = null
    project.status = 'published'
    project.recruitment = 'open'

    await this.notificationsService.createAndNotify({
      type: 'resignedTeam',
      message: `Команду ${team.title} сняли с проекта ${project.title}.`,
      fromUserId: project.userId,
      toUserId: team.teamLeaderId,
      teamId: team.id,
      projectId: project.id
    })

    return await  this.projectRepository.save(project)
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

    if (project.teamId) {
    await this.notificationsService.createAndNotify({
      type: 'completeProject',
      message: `Проект ${project.title} был завершен командой ${project.team.title}`,
      fromUserId: project.userId,
      toUserId: project.team.teamLeaderId,
      teamId: project.teamId,
      projectId: project.id
    })
  }

    project.status = 'completed';
    project.teamId = null;
    project.recruitment = 'close'

    

    return await this.projectRepository.save(project);
  }

  async resubmitProject(projectId: number, userId: number, updateData: {
    title: string;
    problem: string;
    solution: string;
    expectedResult: string;
    stack: string[];
    customer?: string;
    rialtoId: number
    maxPeopleNumber: string
  }) {
    const project = await this.projectRepository.findOne({ 
      where: { id: projectId, userId }
    });
    
    if (!project) {
      throw new NotFoundException('Проект не найден или у вас нет прав');
    }

    if (project.status !== 'revision' && project.status !== 'pending') {
      throw new BadRequestException('Только проекты на доработке или на рассмотрении могут быть отправлены повторно');
    }

    const pgArray = `{${updateData.stack.join(",")}}`

    Object.assign(project, updateData);
    project.status = 'pending';
    project.comment = null;
    project.stack = pgArray
    return await this.projectRepository.save(project);
  }

  async deleteProject(projectId: number): Promise<void> {
    const project = await this.projectRepository.findOne({ 
      where: { id: projectId }
    });
  
    if (!project) {
      throw new NotFoundException('Проект не найден или у вас нет прав на его удаление');
    }
  
    if (['in_progress', 'completed'].includes(project.status)) {
      throw new BadRequestException('Нельзя удалить проект в работе или завершенный проект');
    }
  
    try {
      await this.projectRepository.delete(projectId);
    } catch (error) {
      throw new BadRequestException('Не удалось удалить проект');
    }
  }

  async openRecruitment(id: number) {
    try {
      const project = await this.projectRepository.findOne({where: {id}})

      if (!project) {
        throw new BadRequestException('Проект не найден')
      }

      if (project.recruitment === 'open') {
        throw new BadRequestException('Набор уже открыт')
      }

      project.recruitment = 'open'

      return await this.projectRepository.save(project)

    }
    catch (error) {
      throw new BadRequestException('Не удалось открыть набор')
    }
  }

  async closeRecruitment(id: number) {
    try {
      const project = await this.projectRepository.findOne({where: {id}})

      if (!project) {
        throw new BadRequestException('Проект не найден')
      }

      if (project.recruitment === 'close') {
        throw new BadRequestException('Набор уже закрыт')
      }

      project.recruitment = 'close'

      return await this.projectRepository.save(project)

    }
    catch (error) {
      throw new BadRequestException('Не удалось открыть набор')
    }
  }
}

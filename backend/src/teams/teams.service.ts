import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { EntityManager, In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { TeamRequestService } from 'src/team-request/team-request.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly teamRequestService: TeamRequestService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const teamLeader = await this.userRepository.findOne({
      where: { id: createTeamDto.teamLeaderId },
    });
  
    if (!teamLeader) {
      throw new BadRequestException(`User with id ${createTeamDto.teamLeaderId} not found`);
    }
  
    const teamExists = await this.teamRepository.findOne({
      where: { title: createTeamDto.title },
    });
  
    if (teamExists) {
      throw new BadRequestException('Team with this title already exists');
    }
  
    const team = await this.teamRepository.save({
      title: createTeamDto.title,
      description: createTeamDto.description,
      teamLeader,
      teamLeaderId: createTeamDto.teamLeaderId,
      members: [],
      status: 'close' // По умолчанию новая команда закрыта
    });
  
    if (!teamLeader.leaderOfTeams) {
      teamLeader.leaderOfTeams = [];
    }
  
    teamLeader.leaderOfTeams.push(team.id);
    await this.userRepository.save(teamLeader);
  
    return team;
  }

  async findAll(teamLeaderId: number) {
    return await this.teamRepository.find({where: {
      teamLeaderId: teamLeaderId
    }})
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({where: {id}})

    if (!team) {
      throw new NotFoundException('Команда с id ' + id + ' не найдена')
    }

    return team
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamRepository.findOne({where: {id}})
    if (!team) {
      throw new NotFoundException('Команда с id ' + id + ' не найдена')
    }

    Object.assign(team, updateTeamDto)

    return await this.teamRepository.save(team)
  }

  async remove(id: number) {
    return this.teamRepository.manager.transaction(async (entityManager: EntityManager) => {
      // Находим команду
      const team = await entityManager.findOne(Team, {
        where: { id },
        relations: ['teamLeader'], // Загружаем лидера команды
      });
  
      if (!team) {
        throw new NotFoundException(`Team with id ${id} not found`);
      }
  
      // Находим лидера команды
      const teamLeader = await entityManager.findOne(User, {
        where: { id: team.teamLeaderId },
      });
  
      // Обновляем поле leaderOfTeams у лидера команды
      if (teamLeader && teamLeader.leaderOfTeams) {
        teamLeader.leaderOfTeams = teamLeader.leaderOfTeams.filter(
          (teamId) => teamId !== id,
        );
        await entityManager.save(User, teamLeader);
      }
  
      // Удаляем все запросы на вступление, связанные с этой командой
      await this.teamRequestService.deleteRequestsByTeamId(id);
  
      // Обновляем поле teamId у всех участников команды
      if (team.members && team.members.length > 0) {
        const users = await entityManager.find(User, {
          where: { id: In(team.members) }, // Используем In для поиска участников
        });
  
        for (const user of users) {
          user.teamId = null; // Устанавливаем teamId в null
          await entityManager.save(User, user);
        }
      }
  
      // Удаляем команду
      await entityManager.remove(Team, team);
  
      return { message: `Team with id ${id} has been deleted` };
    });
  }

  async removeMember(teamId: number, userId: number) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });
    if (!team) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }
  
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    if (!team.members.includes(userId)) {
      throw new BadRequestException(`User with id ${userId} is not a member of team ${teamId}`);
    }
  
    team.members = team.members.filter((memberId) => memberId !== userId);
    await this.teamRepository.save(team);
  
    user.teamId = null;
    await this.userRepository.save(user);
  
    return { message: `User with id ${userId} has been removed from team ${teamId}` };
  }

  async openTeam(teamId: number) {
    const team = await this.teamRepository.findOne({
      where: {id: Number(teamId)},
    })

    if (!team) {
      throw new BadRequestException(`Команда с id: ${teamId} не найдена`)
    }

    if (team.status === 'open') {
      throw new BadRequestException(`Команда уже открыта`);
    }
  
    team.status = 'open';
    await this.teamRepository.save(team);
  
    return { 
      message: `Команда "${team.title}" теперь открыта для вступления`,
      team 
    }
  }

  async closeTeam(teamId: number) {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
    });
  
    if (!team) {
      throw new BadRequestException(`Команда с id: ${teamId} не найдена`);
    }
  
    if (team.status === 'close') {
      throw new BadRequestException(`Команда уже закрыта`);
    }
  
    team.status = 'close';
    await this.teamRepository.save(team);
  
    return { 
      message: `Команда "${team.title}" теперь закрыта для вступления`,
      team 
    }
  }
}
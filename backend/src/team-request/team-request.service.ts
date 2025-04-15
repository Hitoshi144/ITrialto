import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { UpdateTeamRequestDto } from './dto/update-team-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamRequest } from './entities/team-request.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';

@Injectable()
export class TeamRequestService {
  constructor(
    @InjectRepository(TeamRequest) private readonly teamRequestRepository: Repository<TeamRequest>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team> 
   ) {}

  async create(createTeamRequestDto: CreateTeamRequestDto) {
    const { userId, teamId } = createTeamRequestDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }

    const existingRequest = await this.teamRequestRepository.findOne({
      where: { userId, teamId },
    });
    if (existingRequest && existingRequest.status === 'pending') {
      throw new BadRequestException('Request already exists');
    }

    if (userId in team.members) {
      throw new BadRequestException('Вы уже являетесь участником данной команды')
    }

    const teamRequest = this.teamRequestRepository.create({
      user,
      team,
      status: 'pending',
    });

    return await this.teamRequestRepository.save(teamRequest);
  }

  async getRequestsForLeader(teamLeaderId: number) {
    return await this.teamRequestRepository.find({
      where: { team: { teamLeaderId }, status: 'pending' },
      relations: ['user', 'team'],
    });
  }

  async updateRequestStatus(id: number, updateTeamRequestDto: UpdateTeamRequestDto) {
    const { status } = updateTeamRequestDto;
  
    const teamRequest = await this.teamRequestRepository.findOne({
        where: { id },
        relations: ['user', 'team', 'team.teamMembers'], // Изменили relations
    });
  
    if (!teamRequest) {
        throw new NotFoundException(`Request with id ${id} not found`);
    }
    else if (teamRequest.status === "approved") {
      throw new BadRequestException("Заявка уже одобрена")
    }
    else if (teamRequest.status === "rejected") {
      throw new BadRequestException("Заявка уже отклонена")
    }
  
    teamRequest.status = status;
    await this.teamRequestRepository.save(teamRequest);
  
    if (status === 'approved') {
        const team = teamRequest.team;
        const user = teamRequest.user;
  
        if (!team.teamMembers.some(member => member.id === user.id)) {
            if (!team.teamMembers) {
                team.teamMembers = [];
            }
            team.teamMembers.push(user);
            team.members.push(user.id)
            await this.teamRepository.save(team);
        }
    }
  
    return teamRequest;
}

  async deleteRequestsByTeamId(teamId: number) {
    await this.teamRequestRepository.delete({ teamId });
  }

  async findMyPendingRequests(userId: number) {
    return await this.teamRequestRepository.find({ where: { userId, status: 'pending' } })
  }
  
}

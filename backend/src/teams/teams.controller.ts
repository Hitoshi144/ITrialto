import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { error } from 'console';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createTeamDto: CreateTeamDto) {
    return await this.teamsService.create(createTeamDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByLeaderId(@Request() req) {
    const teamLeaderId = req.user.id
    return await this.teamsService.findAllByLeaderId(teamLeaderId);
  }

  @Get('members/:id')
  @UseGuards(JwtAuthGuard)
  async getTeamMembers(@Param('id') id: number) {
    try {
      return await this.teamsService.getTeamMembers(+id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.teamsService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    try{ 
      return await this.teamsService.findOne(+id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Get('member/:id')
  @UseGuards(JwtAuthGuard)
  async findByMemberId(@Param('id') id: number) {
    try {
      return await this.teamsService.findAllByMemberId(+id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    try {
      return await this.teamsService.update(+id, updateTeamDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      return await this.teamsService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':teamId/members/:userId')
  @UseGuards(JwtAuthGuard)
  async removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    try {
      return await this.teamsService.removeMember(+teamId, +userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('open/:id')
@UseGuards(JwtAuthGuard)
async openTeam(@Param('id') id: string) {
  try {
    return await this.teamsService.openTeam(+id);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

@Patch('close/:id')
@UseGuards(JwtAuthGuard)
async closeTeam(@Param('id') id: string) {
  try {
    return await this.teamsService.closeTeam(+id);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
}

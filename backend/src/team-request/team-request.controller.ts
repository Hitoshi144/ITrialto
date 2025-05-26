import { Controller, Get, Post, Body, Patch, Param, Request, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TeamRequestService } from './team-request.service';
import { CreateTeamRequestDto } from './dto/create-team-request.dto';
import { UpdateTeamRequestDto } from './dto/update-team-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('team-request')
export class TeamRequestController {
  constructor(private readonly teamRequestService: TeamRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTeamRequestDto: CreateTeamRequestDto) {
    return await this.teamRequestService.create(createTeamRequestDto);
  }

  @Get('leader')
  @UseGuards(JwtAuthGuard)
  async getRequestsForLeader(@Request() req) {
    const teamLeaderId = req.user.id;
    return await this.teamRequestService.getRequestsForLeader(teamLeaderId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMyPendingRequests(@Param('id') id: number) {
    return await this.teamRequestService.findMyPendingRequests(+id)
  }

  @Get(':id/all')
  @UseGuards(JwtAuthGuard)
  async getAllMyRequests(@Param('id') id: number) {
    return await this.teamRequestService.findAllMyRequests(+id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateRequestStatus(
    @Param('id') id: string,
    @Body() updateTeamRequestDto: UpdateTeamRequestDto,
  ) {
    return await this.teamRequestService.updateRequestStatus(+id, updateTeamRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRequest(@Param('id') id: number) {
    return await this.teamRequestService.deleteRequestByRequestId(+id)
  }
}

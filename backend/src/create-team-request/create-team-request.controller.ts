import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CreateTeamRequestService } from './create-team-request.service';
import { CreateCreateTeamRequestDto } from './dto/create-create-team-request.dto';
import { UpdateCreateTeamRequestDto } from './dto/update-create-team-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('create-team-request')
export class CreateTeamRequestController {
  constructor(private readonly createTeamRequestService: CreateTeamRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRequest(@Body() body: { title: string, description?: string }, @Request() req) {
    return await this.createTeamRequestService.createRequest(
      req.user.id, 
      body.title, 
      body.description
    );
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyRequests(@Request() req) {
    return await this.createTeamRequestService.getUserRequests(req.user.id);
  }

  @Get('my/all')
  @UseGuards(JwtAuthGuard)
  async getAllMyRequests(@Request() req) {
    return await this.createTeamRequestService.getAllUserRequests(req.user.id);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingRequests() {
    return await this.createTeamRequestService.getAllPendingRequests();
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approveRequest(@Param('id') id: string, @Request() req) {
    return await this.createTeamRequestService.approveRequest(
      +id, 
      req.user.id
    );
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectRequest(@Param('id') id: string, @Request() req) {
    return await this.createTeamRequestService.rejectRequest(
      +id, 
      req.user.id
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRequest(@Param('id') id: number) {
    return await this.createTeamRequestService.deleteRequest(+id)
  }
}

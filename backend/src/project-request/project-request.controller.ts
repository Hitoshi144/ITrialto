import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { ProjectRequestService } from './project-request.service';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('project-request')
export class ProjectRequestController {
  constructor(private readonly projectRequestService: ProjectRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRequest(
    @Body() createDto: CreateProjectRequestDto,
    @Request() req
  ) {
    try {
      const userId = req.user.id;
      return await this.projectRequestService.createRequest(
        createDto.projectId,
        createDto.teamId,
        userId
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my-team/:id')
  @UseGuards(JwtAuthGuard)
  async getMyTeamRequests(@Param('id') id: number) {
    try {
      return await this.projectRequestService.getTeamRequests(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('project/:projectId')
  @UseGuards(JwtAuthGuard)
  async getProjectRequests(@Param('projectId') projectId: string) {
    try {
      return await this.projectRequestService.getProjectRequests(+projectId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approveRequest(@Param('id') id: string) {
    try {
      return await this.projectRequestService.approveRequest(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectRequest(@Param('id') id: string) {
    try {
      return await this.projectRequestService.rejectRequest(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

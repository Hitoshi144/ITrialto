import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(@Body() body: {
    title: string;
    problem: string;
    solution: string;
    expectedResult: string;
    stack: string[];
    customer?: string;
    rialtoId: number
    maxPeopleNumber: string
  }, @Request() req) {
    try {
      return await this.projectService.createProject({
        ...body,
        userId: req.user.id,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyProjects(@Request() req) {
    try {
      return await this.projectService.getUserProjects(req.user.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllProjects() {
    try {
      return await this.projectService.getAllProjects();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingProjects() {
    try {
      return await this.projectService.getAllProjects('pending');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProjectDetails(@Param('id') id: string) {
    try {
      return await this.projectService.getProjectDetails(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishProject(@Param('id') id: string) {
    try {
      return await this.projectService.updateProjectStatus(+id, 'published');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/revision')
  @UseGuards(JwtAuthGuard)
  async sendToRevision(@Param('id') id: string, @Body() body: { comment: string }) {
    try {
      return await this.projectService.updateProjectStatus(+id, 'revision', body.comment);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectProject(@Param('id') id: string) {
    try {
      return await this.projectService.updateProjectStatus(+id, 'rejected');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/assign-team')
  @UseGuards(JwtAuthGuard)
  async assignTeam(@Param('id') id: string, @Body() body: { teamId: number }) {
    try {
      return await this.projectService.assignTeamToProject(+id, body.teamId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  async completeProject(@Param('id') id: string) {
    try {
      return await this.projectService.completeProject(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/resubmit')
  @UseGuards(JwtAuthGuard)
  async resubmitProject(
    @Param('id') id: string,
    @Request() req,
    @Body() updateData: {
      title: string;
      problem: string;
      solution: string;
      expectedResult: string;
      stack: string[];
      customer?: string;
      rialtoId: number
      maxPeopleNumber: string
    }
  ) {
    try {
      return await this.projectService.resubmitProject(+id, req.user.id, updateData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthGuard)
  async deleteProject(@Param('id') id: number){
    try {
      return await this.projectService.deleteProject(id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

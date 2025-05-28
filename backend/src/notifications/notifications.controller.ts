import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@Request() req) {
    try {
      const userId = req.user.id
      return await this.notificationsService.findAllForUser(userId)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markNotificationRead(@Param('id') id: number) {
    try {
      return await this.notificationsService.markAsRead(+id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllRead(@Request() req) {
    try {
      const userId = req.user.id
      await this.notificationsService.markAllAsRead(userId)
      return { status: 'success' }
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

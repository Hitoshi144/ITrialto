import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('private')
  async createPrivateChat(@Request() req, @Body() body: {user2Id: number}) {
    try {
      return await this.chatService.createPrivateChat(req.id, body.user2Id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post('group')
  async createGroupChat(@Request() req, @Body() body: {name: string, userIds: number[]}) {
    try {
      return await this.chatService.createGroupChat(req.id, body.name, body.userIds)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add')
  async addParticipants(@Body() body: {chatId: number, userIds: number[]}) {
    try {
      return await this.chatService.addParticipants(body.chatId, body.userIds)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove')
  async removeParticipants(@Body() body: {chatId: number, userIds: number[]}) {
    try {
      return await this.chatService.removeParticipants(body.chatId, body.userIds)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Patch('name')
  async updateChatName(@Body() body: {chatId: number, name: string}) {
    try {
      return await this.chatService.updateChatName(body.chatId, body.name)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getUserChats(@Body() body: {userId: number}) {
    try {
      return await this.chatService.getUserChats(body.userId)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread')
  async getUnreadMessagesCount(@Request() req) {
    try {
      return await this.chatService.getUnreadMessagesCount(req.id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getChatById(@Param('id') id: number) {
    try {
      return await this.chatService.getChatById(+id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post('message')
  async sendMessage(@Request() req, @Body() body: {chatId: number, content: string}) {
    try {
      return await this.chatService.sendMessage(body.chatId, req.id, body.content)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  async getChatMessages(@Param('id') id: number) {
    try {
      return await this.chatService.getChatMessages(+id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteChat(@Param('id') id: number, @Request() req) {
    try {
      return await this.chatService.deleteChat(+id, req.id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async markMessagesAsRead(@Param('id') id: number, @Request() req) {
    try {
      return await this.chatService.markMessagesAsRead(+id, req.id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }
}

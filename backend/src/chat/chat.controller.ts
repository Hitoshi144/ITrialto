import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, Query } from '@nestjs/common';
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
      return await this.chatService.createPrivateChat(req.user.id, body.user2Id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post('group')
  async createGroupChat(@Request() req, @Body() body: {name: string, userIds: number[]}) {
    try {
      return await this.chatService.createGroupChat(req.user.id, body.name, body.userIds)
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
  async getUserChats(@Query('userId') userId: number) {
    try {
      return await this.chatService.getUserChats(+userId)
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
  async sendMessage(@Body() body: {chatId: number, senderId: number, content: string}) {
    try {
      return await this.chatService.sendMessage(body.chatId, body.senderId, body.content)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post('chatting/:id')
  async userChatting(@Param('id') id: number, @Request() req) {
    try {
      await this.chatService.userChatting(+id, req.user.id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('stopchatting/:id')
  async stopChatting(@Param('id') id: number, @Request() req) {
    try {
      await this.chatService.stopChatting(+id, req.user.id)
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
      return await this.chatService.deleteChat(+id, req.user.id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':messageId')
  async markMessagesAsRead(@Param('messageId') messageId: number, @Request() req) {
    try {
      return await this.chatService.markMessagesAsRead(+messageId, req.user.id)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    } 
  }
}

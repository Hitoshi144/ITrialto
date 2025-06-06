import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException, Query, UploadedFile, UseInterceptors, StreamableFile, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as sharp from 'sharp'
import * as fs from 'fs'
import { Socket } from 'dgram';
import { SocketService } from 'src/socket/socket.service';

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

  @Post('avatar/:chatId')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('avatar', {
  storage: diskStorage({
    destination: './uploads/chats',
    filename: (req, file, cb) => {
      // Убираем .jpg здесь, так как sharp добавит его
      cb(null, `${req.params.chatId}`);
    }
  })
}))
async uploadChatAvatar(
  @Param('chatId') chatId: string,
  @UploadedFile() file: Express.Multer.File,
) {
  const outputPath = join(process.cwd(), 'uploads', 'chats', `${file.filename}.jpg`);
  
  await sharp(file.path)
    .resize({
      width: 200,
      height: 200,
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  // Удаляем временный файл без расширения
  if (existsSync(file.path)) {
    await fs.promises.unlink(file.path);
  }

  const chat = await this.chatService.getChatById(Number(chatId))
  if (!chat) throw new NotFoundException('Чат не найден');
  
  chat.participants.forEach(user => {
    this.chatService.deliverNewAvatar(user.id, chat.id)
  })

  return { message: 'Chat avatar uploaded successfully' };
}

@Get('avatar/:chatId')
getChatAvatar(@Param('chatId') chatId: string) {
  const avatarPath = join(process.cwd(), 'uploads', 'chats', `${chatId}.jpg`);
  
  if (!existsSync(avatarPath)) {
    return null;
  }

  return new StreamableFile(createReadStream(avatarPath), {
    type: 'image/jpeg',
    disposition: `inline; filename="${chatId}.jpg"`
  });
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

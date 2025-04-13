import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Res, UploadedFile, UseInterceptors, Req, StreamableFile, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { RequestWithUser } from 'src/types/types';
import { createReadStream, existsSync } from 'fs';
import * as sharp from 'sharp';
import * as fs from 'fs'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('avatar')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('avatar', {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req: RequestWithUser, file, cb) => {
      if (!req.user) {
        return cb(new Error('User not authenticated'), '');
      }
      // Убираем .jpg здесь, так как sharp добавит его
      cb(null, `${req.user.id}`); // <-- Изменили эту строку
    }
  })
}))
async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
  const outputPath = join(process.cwd(), 'uploads', 'avatars', `${file.filename}.jpg`); // .jpg добавляется только здесь
  
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

  return { message: 'Avatar uploaded successfully' };
}

  @Get('avatar/:userId')
  getAvatar(@Param('userId') userId: string) {
    const avatarPath = join(process.cwd(), 'uploads', 'avatars', `${userId}.jpg`);
    
    if (!existsSync(avatarPath)) {
      return null;
    }
  
    return new StreamableFile(createReadStream(avatarPath), {
      type: 'image/jpeg',
      disposition: `inline; filename="${userId}.jpg"`
    });
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: number) {
    return await this.userService.getUser(userId)
  }
}

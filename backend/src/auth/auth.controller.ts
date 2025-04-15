import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { IUpdateUser, IUser } from 'src/types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const result = this.authService.login(req.user);
    return {
      id: (await result)?.id,
      mail: (await result)?.mail,
      firstname: (await result)?.firstname,
      lastname: (await result)?.lastname,
      group: (await result)?.group,
      phone: (await result)?.phone,
      role: (await result)?.role,
      createdAt: (await result)?.createAt,
      updateAt: (await result)?.updateAt,
      token: (await result)?.token
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const userMail = req.user.mail
    const user = await this.userService.findOne(userMail)

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден')
    }
    return {id: user.id, mail: user.mail, firstname: user.firstname, lastname: user.lastname, phone: user.phone, role: user.role, group: user.group, createAt: user.createAt, aboutMe: user.aboutMe, competencies: user.competencies};
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateData: IUpdateUser) {
    const userMail = req.user.mail; // Получаем email пользователя из JWT-токена
    const updatedUser = await this.authService.updateProfile(userMail, updateData);

    if (!updatedUser) {
      throw new UnauthorizedException('Не удалось обновить данные пользователя');
    }

    return updatedUser;
  }
}

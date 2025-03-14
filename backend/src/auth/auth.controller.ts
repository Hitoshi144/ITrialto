import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const result = this.authService.login(req.user);
    return {
      id: (await result).id,
      mail: (await result).mail,
      firstname: (await result).firstname,
      lastname: (await result).lastname,
      group: (await result).group,
      phone: (await result).phone,
      role: (await result).role,
      createdAt: (await result).createdAt,
      updateAt: (await result).updateAt,
      token: (await result).token
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}

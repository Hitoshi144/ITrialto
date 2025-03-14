import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(mail: string, password: string) {
    const user = await this.userService.findOne(mail)

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден')
    }

    const passwordIsMatch = await argon2.verify(user.password, password)

    if (user && passwordIsMatch) {
      return {user}
    }

    throw new UnauthorizedException('Введён неверный пароль')
  }

  async login(user: IUser) {
    const userResult = await this.userService.findOne(user.mail)
    if (userResult)
    return {
      id: userResult.id, mail: userResult.mail, firstname: userResult.firstname, lastname: userResult.lastname, group: userResult.group, phone: userResult.phone, role: userResult.role, createdAt: userResult.createAt, updateAt: userResult.updateAt, token: this.jwtService.sign({id: user.id, mail: user.mail})
    }
  }
}

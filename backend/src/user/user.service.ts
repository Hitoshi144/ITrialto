import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: {
        mail: createUserDto.mail,
      },
    })

    if (userExists) {
      throw new BadRequestException('Пользователь с данной почтой уже существует')
    }
    
    const user = await this.userRepository.save({
      mail: createUserDto.mail,
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      password: await argon2.hash(createUserDto.password)
    })

    const token = this.jwtService.sign({mail: createUserDto.mail})

    return {user, token}
  }

  async findOne(mail: string) {
    return await this.userRepository.findOne({
      where: 
        {mail: mail}})
  }
}

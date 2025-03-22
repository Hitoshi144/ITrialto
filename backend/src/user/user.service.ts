import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { IUpdateUser, IUser } from 'src/types/types';

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
      group: createUserDto.group,
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      password: await argon2.hash(createUserDto.password),
      role: createUserDto.role
    })

    const token = this.jwtService.sign({mail: createUserDto.mail})

    return {id: user.id, mail: user.mail, firstname: user.firstname, lastname: user.lastname, group: user.group, phone: user.phone, role: user.role, createAt: user.createAt, updateAt: user.updateAt, token}
  }

  async findOne(mail: string) {
    return await this.userRepository.findOne({
      where: 
        {mail: mail}})
  }

  async update(id: number, updateData: IUpdateUser): Promise<IUser> {
    await this.userRepository.update(id, updateData);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
}

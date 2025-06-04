import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Not, Repository } from 'typeorm';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { IUpdateUser, IUser } from 'src/types/types';
import sharp from 'sharp';

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

  async processAvatar(inputPath: string, outputPath: string): Promise<void> {
    await sharp(inputPath)
      .resize(50, 50)
      .toFormat('jpeg')
      .toFile(outputPath);
  }

  async getUser(userId: number) {
    const user = await this.userRepository.findOne({where: {id: userId}})

    return user
  }

  async searchUsers(request: string, userId: number) {
    try {
      if (!request.trim()) {
        return [];
    }

    // Ищем пользователей в базе данных
    const users = await this.userRepository.find({
        where: [
            { firstname: ILike(`%${request}%`) }, // Поиск по имени (без учета регистра)
            { lastname: ILike(`%${request}%`) },  // Поиск по фамилии
            { mail: ILike(`%${request}%`) }      // Поиск по email
        ],
        // Исключаем текущего пользователя из результатов
        ...(userId ? { id: Not(userId) } : {})
    });

    // Убираем дубликаты (если пользователь попадает под несколько условий)
    const uniqueUsers = users.filter(
        (user, index, self) => index === self.findIndex(u => u.id === user.id)
    );

    return uniqueUsers;
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

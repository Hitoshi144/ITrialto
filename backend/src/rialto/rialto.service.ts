import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRialtoDto } from './dto/create-rialto.dto';
import { UpdateRialtoDto } from './dto/update-rialto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rialto } from './entities/rialto.entity';

@Injectable()
export class RialtoService {
  constructor (
    @InjectRepository(Rialto) private readonly rialtoRepository: Repository<Rialto>,
  ) {}

  async create(createRialtoDto: CreateRialtoDto) {
    try {
      const rialto = await this.rialtoRepository.save(createRialtoDto)
      return rialto
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    const rialtos = await this.rialtoRepository.find()
    return rialtos
  }

  async findOne(id: number) {
    return await this.rialtoRepository.findOne({where: { id }})
  }

  update(id: number, updateRialtoDto: UpdateRialtoDto) {
    return `This action updates a #${id} rialto`;
  }

  async remove(id: number) {
    try {
      const rialto = await this.rialtoRepository.findOne({where: {id}})

      if (!rialto) {
        throw new BadRequestException('Биржа не найдена')
      }
      
      await this.rialtoRepository.remove(rialto)
    }
    catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}

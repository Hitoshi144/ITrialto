import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RialtoService } from './rialto.service';
import { CreateRialtoDto } from './dto/create-rialto.dto';
import { UpdateRialtoDto } from './dto/update-rialto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('rialto')
export class RialtoController {
  constructor(private readonly rialtoService: RialtoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createRialtoDto: CreateRialtoDto) {
    return await this.rialtoService.create(createRialtoDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.rialtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rialtoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRialtoDto: UpdateRialtoDto) {
    return this.rialtoService.update(+id, updateRialtoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    return await  this.rialtoService.remove(+id);
  }
}

import { Module } from '@nestjs/common';
import { RialtoService } from './rialto.service';
import { RialtoController } from './rialto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rialto } from './entities/rialto.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rialto]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '30d'},
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [RialtoController],
  providers: [RialtoService],
})
export class RialtoModule {}

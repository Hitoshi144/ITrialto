import { Module } from '@nestjs/common';
import { CreateTeamRequestService } from './create-team-request.service';
import { CreateTeamRequestController } from './create-team-request.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTeamRequest } from './entities/create-team-request.entity';
import { User } from 'src/user/entities/user.entity';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreateTeamRequest, User]),
    TeamsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '30d'},
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [CreateTeamRequestController],
  providers: [CreateTeamRequestService],
})
export class CreateTeamRequestModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TeamRequestService } from './team-request.service';
import { TeamRequestController } from './team-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TeamRequest } from './entities/team-request.entity';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { SocketService } from 'src/socket/socket.service';
import { SocketModule } from 'src/socket/socket.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, User, TeamRequest]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '30d'},
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => SocketModule),
    forwardRef(() => NotificationsModule)
  ],
  controllers: [TeamRequestController],
  providers: [TeamRequestService],
  exports: [TeamRequestService]
})
export class TeamRequestModule {}

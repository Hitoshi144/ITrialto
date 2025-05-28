import { forwardRef, Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { TeamRequestService } from 'src/team-request/team-request.service';
import { TeamRequestModule } from 'src/team-request/team-request.module';
import { TeamRequest } from 'src/team-request/entities/team-request.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, User, TeamRequest]),
    forwardRef(() => TeamRequestModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => SocketModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '30d'},
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRequestService],
  exports: [TeamsService]
})
export class TeamsModule {}

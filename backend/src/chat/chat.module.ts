import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entities/project.entity';
import { SocketModule } from 'src/socket/socket.module';
import { Team } from 'src/teams/entities/team.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { User } from 'src/user/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Message } from 'src/message/entities/message.entity';
import { UserService } from 'src/user/user.service';
import { SocketService } from 'src/socket/socket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, User, Message]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '30d'},
      }),
      inject: [ConfigService],
    }),
    SocketModule
  ],
  controllers: [ChatController],
  providers: [ChatService, UserService],
})
export class ChatModule {}

import { forwardRef, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        forwardRef(() => NotificationsModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'),
              signOptions: {expiresIn: '30d'},
            }),
            inject: [ConfigService],
          }),
    ],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
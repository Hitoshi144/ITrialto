// ws-jwt.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      throw new WsException('Unauthorized');
    }
    return user;
  }

  getRequest(context: any) {
    return context.switchToWs().getClient().handshake;
  }
}
import { Injectable, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";
import { Socket } from 'socket.io'
import { AuthenticatedSocket } from "src/types/types";

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super()
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    const handshake = client.handshake;

    const token = handshake.auth?.token ||
                  handshake.headers?.authorization?.split(' ')[1] ||
                  handshake.query?.token;

    if (!token) {
      console.error('Token not found in handshake:', {
        auth: handshake.auth,
        headers: handshake.headers,
        query: handshake.query,
      });
      throw new WsException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token); // или this.authService.verify()
      console.log(payload)
      client.user = payload; // <--- вот это обязательно!
      console.log('[WsJwtGuard] Authenticated user:', payload);
      return true;
    } catch (error) {
      console.error('[WsJwtGuard] Invalid token:', error.message);
      throw new WsException('Unauthorized');
    }
  }

  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.token ||
                  client.handshake.headers?.authorization?.split(' ')[1] ||
                  client.handshake.query?.token;

    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  }

  
}

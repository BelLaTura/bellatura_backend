import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { SHA256 } from 'crypto-js';
import GetResponse from 'src/utils/getResponse';
import { SessionsService } from 'src/api/v1/sessions/sessions.service';

@Injectable()
export class VerifyAccessTokenGuard implements CanActivate {
  constructor(private readonly sessionService: SessionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const accessToken = this.sessionService.getBearerToken(req);
    const payload = await this.sessionService.getVerifyAccessToken(accessToken);
    const userId = payload.id;

    const hash1 = SHA256(accessToken).toString();
    const sessions = await this.sessionService.getAccessHashs(userId);

    for (let i = 0; i < sessions.length; ++i) {
      const hash2 = sessions[i].rs_accessHash;
      if (hash2 === hash1) {
        req.custom__accessHash = hash2;
        req.custom__userId = userId;
        return true;
      }
    }

    const data = {};
    const message = 'Нет сеанса с таким токеном доступа';
    const json = GetResponse.getUnauthorizedResponse(message, data);
    throw new HttpException(json, json.statusCode);
  }
}

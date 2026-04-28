import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { AppConfigService } from 'src/modules/configuration/appConfig.service';
import { RequestWithUserId } from 'src/types/Request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUserId = context.switchToHttp().getRequest();

    const accessToken = request.cookies['accessToken'] as string | undefined;

    if (!accessToken) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const { user_id } = jwt.verify(
        accessToken,
        this.configService.jwt.accessSecretValue,
      ) as { user_id?: string };

      if (!user_id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.userId = user_id;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

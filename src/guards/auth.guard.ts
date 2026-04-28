import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfigService } from 'src/modules/configuration/appConfig.service';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithUser } from 'src/types/Request';
import { verifyJwt } from 'src/utils/verifyJwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: AppConfigService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const accessToken = request.cookies['accessToken'] as string | undefined;

    if (!accessToken) {
      throw new UnauthorizedException('Token not found');
    }

    const { userId } = verifyJwt<{ userId?: string }>(
      accessToken,
      this.configService.jwt.accessSecretValue,
      new UnauthorizedException('Invalid or expired token'),
    );

    if (!userId) {
      throw new UnauthorizedException('Token payload is in incorrect format');
    }

    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException("User wasn't found");
    }
    request.user = user;

    return true;
  }
}

import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequestWithUser } from 'src/types/Request';
import { User } from 'src/types/User';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new InternalServerErrorException(
        `Developer error: ${CurrentUser.name} decorator must be used after authGuard`,
      );
    }

    if (!data) {
      return request.user;
    }
    return request.user[data];
  },
);

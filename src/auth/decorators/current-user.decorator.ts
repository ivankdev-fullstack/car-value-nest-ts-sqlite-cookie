import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): User | undefined => {
    const req = ctx.switchToHttp().getRequest();
    if (!req?.user) {
      throw new UnauthorizedException('Not authorized.');
    }

    return req.user;
  },
);

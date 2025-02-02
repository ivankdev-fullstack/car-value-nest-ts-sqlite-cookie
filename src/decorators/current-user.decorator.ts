import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): User | undefined => {
    const user: User | undefined = ctx.switchToHttp().getRequest()?.user;
    if (!user) {
      throw new UnauthorizedException('Not authorized.');
    }

    return user;
  },
);

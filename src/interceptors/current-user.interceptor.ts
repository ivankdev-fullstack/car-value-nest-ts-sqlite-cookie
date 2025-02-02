import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.session?.userId;

    if (userId) {
      req.user = await this.userService.getById(userId);
    }

    return next.handle();
  }
}

import { NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const userId = req.session?.userId;

    if (userId) {
      req.user = await this.userRepository.findOneBy({ id: userId });
    }

    next();
  }
}

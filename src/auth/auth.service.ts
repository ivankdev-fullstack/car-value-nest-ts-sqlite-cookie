import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/entity/user.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async signupUser(data: CreateUserDto): Promise<User> {
    return this.userRepository.save(data);
  }
}

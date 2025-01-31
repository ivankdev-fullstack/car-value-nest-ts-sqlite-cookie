import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/entity/user.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  public async signinUser(data: CreateUserDto): Promise<User> {
    const user = await this.userService.getBy({ email: data.email });
    if (!user) {
      throw new BadRequestException('User is not registered with this email.');
    }

    const unhashedPass = CryptoJS.AES.decrypt(
      user.password,
      'secret_key',
    ).toString(CryptoJS.enc.Utf8);

    const isValid = unhashedPass === data.password;
    if (!isValid) {
      throw new UnauthorizedException('Email or password is not correct');
    }

    return user;
  }

  public async signupUser(data: CreateUserDto): Promise<User> {
    const isExist = await this.userService.getBy({ email: data.email });
    if (isExist) {
      throw new BadRequestException('User already exists.');
    }

    const hashedPass = CryptoJS.AES.encrypt(
      data.password,
      'secret_key',
    ).toString();

    const newUser = this.userRepository.create({
      ...data,
      password: hashedPass,
    });
    return this.userRepository.save(newUser);
  }
}

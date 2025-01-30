import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/entity/user.dto';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signin')
  // public async signup(@Body() body: CreateUserDto): Promise<User> {
  //   return this.authService.signupUser(body);
  // }

  @Post('signup')
  public async signupUser(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signupUser(body);
  }
}

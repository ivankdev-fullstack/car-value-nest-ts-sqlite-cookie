import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/entity/user.dto';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  public async me(@Session() session: any): Promise<User> {
    if (!session.userId) {
      throw new UnauthorizedException('Not authorized.');
    }
    return this.userService.getById(session.userId);
  }

  @Post('signin')
  @HttpCode(200)
  public async signinUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signinUser(body);
    session.userId = user.id;
    return user;
  }

  @Post('signup')
  public async signupUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signupUser(body);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  @HttpCode(200)
  public async signoutUser(@Session() session: any): Promise<void> {
    session.userId = null;
  }
}

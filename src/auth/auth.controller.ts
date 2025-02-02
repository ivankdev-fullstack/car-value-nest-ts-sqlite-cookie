import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import { CreateUserDto } from '../user/entity/user.dto';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  public async me(@CurrentUser() user: User): Promise<User> {
    return user;
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

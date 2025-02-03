import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserDto, UserDto } from './entity/user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('users')
@Serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/:id')
  public async getById(@Param('id') id: number): Promise<User> {
    return this.userService.getById(id);
  }

  @Patch('/:id')
  public async updateById(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateById(id, body);
  }

  @Get('/:id')
  public async deleteById(@Param('id') id: number): Promise<boolean> {
    return this.userService.deleteById(id);
  }
}

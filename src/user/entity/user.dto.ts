import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Min } from 'class-validator';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Min(6)
  password: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}

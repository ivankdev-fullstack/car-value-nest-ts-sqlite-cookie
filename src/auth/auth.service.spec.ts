import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as CryptoJS from 'crypto-js';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let userRepository: Partial<Repository<User>>;
  let users: User[];

  beforeEach(async () => {
    users = [];

    userService = {
      getBy: jest.fn((data: Partial<User>) => {
        const user = users.filter((user) =>
          Object.entries(data).every(
            ([key, value]) => user[key as keyof User] === value,
          ),
        )[0];

        return Promise.resolve(user);
      }),
    };

    userRepository = {
      // @ts-ignore
      create: jest.fn((data: Partial<User>) => {
        return { id: Math.floor(Math.random() * 999999), ...data } as User;
      }),
      // @ts-ignore
      save: jest.fn((user: User) => {
        users.push(user);
        return Promise.resolve(user);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signupUser', () => {
    it('should successfully sign up a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await authService.signupUser(newUser);

      expect(userService.getBy).toHaveBeenCalledWith({ email: newUser.email });
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
      expect(createdUser).toHaveProperty('id');
      expect(createdUser).toHaveProperty('email', newUser.email);
    });

    it('should throw an error if the user already exists', async () => {
      users.push({
        id: 1,
        email: 'test@example.com',
        password: 'encrypted',
      } as User);

      await expect(
        authService.signupUser({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signinUser', () => {
    it('should sign in a user with correct credentials', async () => {
      const password = 'password123';
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        'secret_key',
      ).toString();

      users.push({
        id: 1,
        email: 'test@example.com',
        password: encryptedPassword,
      } as User);

      const user = await authService.signinUser({
        email: 'test@example.com',
        password,
      });

      expect(user).toHaveProperty('email', 'test@example.com');
    });

    it('should throw an error if the user is not registered', async () => {
      await expect(
        authService.signinUser({
          email: 'notfound@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the password is incorrect', async () => {
      const encryptedPassword = CryptoJS.AES.encrypt(
        'correctPassword',
        'secret_key',
      ).toString();

      users.push({
        id: 1,
        email: 'test@example.com',
        password: encryptedPassword,
      } as User);

      await expect(
        authService.signinUser({
          email: 'test@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

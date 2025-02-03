import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './entity/user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Partial<Repository<User>>;
  let users: User[];

  beforeEach(async () => {
    users = [];

    userRepository = {
      find: jest.fn(() => Promise.resolve(users)),
      findOneBy: jest.fn((data: Partial<User>) => {
        const user =
          users.filter((user) =>
            Object.entries(data).every(
              ([key, value]) => user[key as keyof User] === value,
            ),
          )[0] || null;
        return Promise.resolve(user);
      }),
      // @ts-ignore
      save: jest.fn((user: User) => {
        const existingIndex = users.findIndex((u) => u.id === user.id);
        if (existingIndex > -1) {
          users[existingIndex] = { ...users[existingIndex], ...user };
        } else {
          users.push(user);
        }
        return Promise.resolve(user);
      }),
      // @ts-ignore
      remove: jest.fn((user: User) => {
        const index = users.findIndex((u) => u.id === user.id);
        if (index > -1) {
          users.splice(index, 1);
          return Promise.resolve(user);
        }
        return Promise.reject(new NotFoundException('User not found.'));
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      users.push({
        id: 1,
        email: 'test@example.com',
        password: 'pass',
      } as User);
      const result = await userService.getAll();
      expect(result).toHaveLength(1);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      users.push({
        id: 1,
        email: 'test@example.com',
        password: 'pass',
      } as User);
      const user = await userService.getById(1);
      expect(user).toHaveProperty('email', 'test@example.com');
    });

    it('should throw NotFoundException if user is not found', async () => {
      await expect(userService.getById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBy', () => {
    it('should return a user by given data', async () => {
      users.push({
        id: 1,
        email: 'test@example.com',
        password: 'pass',
      } as User);
      const user = await userService.getBy({ email: 'test@example.com' });
      expect(user).toHaveProperty('email', 'test@example.com');
    });

    it('should return null if no user is found', async () => {
      const user = await userService.getBy({ email: 'notfound@example.com' });
      expect(user).toBeNull();
    });
  });

  describe('updateById', () => {
    it('should update and return the updated user', async () => {
      users.push({
        id: 1,
        email: 'test@example.com',
        password: 'pass',
      } as User);
      const updatedData: UpdateUserDto = { email: 'updated@example.com' };
      const updatedUser = await userService.updateById(1, updatedData);
      expect(updatedUser).toHaveProperty('email', 'updated@example.com');
    });

    it('should throw NotFoundException if user is not found', async () => {
      await expect(
        userService.updateById(999, { email: 'updated@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('should delete a user and return true', async () => {
      users.push({
        id: 1,
        email: 'test@example.com',
        password: 'pass',
      } as User);
      const result = await userService.deleteById(1);
      expect(result).toBe(true);
      expect(users).toHaveLength(0);
    });

    it('should throw NotFoundException if user is not found', async () => {
      await expect(userService.deleteById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, Module, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create fake copy of UsersService
    fakeUsersService = {
      find: () => {
        return Promise.resolve([]);
      },
      create: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password });
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an isntance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a user with an email and hashed password', async () => {
    const user = await service.signup('sude@test.io', '1234');
    expect(user.password).not.toEqual('1234');

    const hash = user.password;

    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { User, UserPropsDTO } from '@/users/domain/entities/User';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { RegisterDto } from '@/auth/infra/http/dtos/register.dto';
import { LoginDto } from '@/auth/infra/http/dtos/login.dto';
import { Result } from '@/shared/core/Result';
import { Password } from '@/users/domain/entities/Password';

const user: UserPropsDTO = {
  id: 'abc',
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: Password.hash('asd123'),
  accountId: 'xyz',
};

const registerDTO: RegisterDto = {
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd123',
};

const loginDTO: LoginDto = {
  email: 'test@gmail.com',
  password: 'asd123',
};

describe('Auth Service', () => {
  let service: AuthService;

  const busMock = { execute: jest.fn() };
  const jwtMock = { sign: jest.fn().mockReturnValue('asdqwezxc') };
  const usersRepositoryMock = {
    findOneByEmail: jest.fn().mockReturnValue(User.create(user)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CommandBus, useValue: busMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    busMock.execute.mockReset();
    jwtMock.sign.mockClear();
    usersRepositoryMock.findOneByEmail.mockClear();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Register', () => {
    it('Should successfully register to the app', async () => {
      busMock.execute.mockReturnValueOnce(Result.ok(user));

      const registerResult = await service.register(registerDTO);

      const payload = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      expect(registerResult.isSuccess).toBe(true);
      expect(jwtMock.sign).toHaveBeenCalledWith(payload);

      const data = registerResult.getValue();
      expect(data).toMatchObject({
        ...payload,
        token: jwtMock.sign.getMockImplementation()(),
      });
    });

    it('Should fail if cannot register a user', async () => {
      busMock.execute.mockReturnValueOnce(Result.fail('Error'));

      const registerResult = await service.register(registerDTO);
      expect(registerResult.isSuccess).toBe(false);
    });
  });

  describe('Login', () => {
    it('Should successfully login to the app', async () => {
      const loginResult = await service.login(loginDTO);

      const payload = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      expect(loginResult.isSuccess).toBe(true);
      expect(jwtMock.sign).toHaveBeenCalledWith(payload);

      const data = loginResult.getValue();
      expect(data).toMatchObject({
        ...payload,
        token: jwtMock.sign.getMockImplementation()(),
        accountId: user.accountId,
      });
    });

    it('Should fail if the user with the email was not found', async () => {
      usersRepositoryMock.findOneByEmail.mockReturnValueOnce(
        Result.fail('Error'),
      );

      const loginResult = await service.login(loginDTO);

      expect(loginResult.isSuccess).toBe(false);
      expect(loginResult.getErrorValue()).toBe('Credenciales inválidas');
    });

    it('Should fail if the passwords does not match', async () => {
      const loginResult = await service.login({
        ...loginDTO,
        password: 'invalid-password',
      });

      expect(loginResult.isSuccess).toBe(false);
      expect(loginResult.getErrorValue()).toBe('Credenciales inválidas');
    });
  });
});

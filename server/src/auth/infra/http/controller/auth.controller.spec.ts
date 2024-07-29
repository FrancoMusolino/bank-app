import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from '@/auth/application/services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { Result } from '@/shared/core/Result';
import { LoginDto } from '../dtos/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    authServiceMock.login.mockReset();
    authServiceMock.register.mockReset();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return the user info on success register', async () => {
    const dto: RegisterDto = {
      email: 'test@gmail.com',
      firstname: 'Test',
      lastname: 'Test',
      password: '1234',
    };

    const registerResponse = Result.ok({
      id: expect.any(String),
      firstname: dto.firstname,
      lastname: dto.lastname,
      token: 'asd',
    });
    authServiceMock.register.mockResolvedValueOnce(registerResponse);

    const res = await controller.register(dto);
    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(res).toMatchObject(registerResponse.getValue());
  });

  it('Should throw exception on failure register', async () => {
    const dto: RegisterDto = {
      email: 'test@gmail.com',
      firstname: 'Test',
      lastname: 'Test',
      password: '1234',
    };

    authServiceMock.register.mockResolvedValueOnce(Result.fail('Error'));
    await expect(controller.register(dto)).rejects.toThrowError(HttpException);
  });

  it('Should return the user info on success login', async () => {
    const dto: LoginDto = {
      email: 'test@gmail.com',
      password: '1234',
    };

    const login = Result.ok({
      id: expect.any(String),
      firstname: 'Test',
      lastname: 'Test',
      token: 'asd',
      accountId: 'asd',
    });
    authServiceMock.login.mockResolvedValueOnce(login);

    const res = await controller.login(dto);
    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    expect(res).toMatchObject(login.getValue());
  });

  it('Should throw exception on failure login', async () => {
    const dto: LoginDto = {
      email: 'test@gmail.com',
      password: '1234',
    };

    authServiceMock.login.mockResolvedValueOnce(Result.fail('Error'));
    await expect(controller.login(dto)).rejects.toThrowError(HttpException);
  });
});

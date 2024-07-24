import { Test } from '@nestjs/testing';
import { RegisterUserHandler } from './register-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { RegisterUserCommand } from '../register-user.command';
import { User } from '@/users/domain/entities/User';
import { Result } from '@/shared/core/Result';

const commandData: RegisterUserCommand['data'] = {
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd',
};

describe('Register User use case', () => {
  let handler: RegisterUserHandler;

  const commitFn = jest.spyOn(User.prototype, 'commit').mockReturnThis();

  const usersRepositoryMock = {
    exists: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        RegisterUserHandler,
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    handler = module.get<RegisterUserHandler>(RegisterUserHandler);
  });

  afterEach(() => {
    usersRepositoryMock.exists.mockReset();
    usersRepositoryMock.save.mockReset();
    commitFn.mockClear();
  });

  it('Should successfully register a user', async () => {
    usersRepositoryMock.exists.mockReturnValue(false);

    const registerUserResult = await handler.execute(
      new RegisterUserCommand(commandData),
    );

    expect(usersRepositoryMock.save).toHaveBeenCalled();
    expect(commitFn).toHaveBeenCalled();
    expect(registerUserResult.isSuccess).toBe(true);

    const user = registerUserResult.getValue();
    expect(user.password).not.toBe(commandData.password);
    expect(user).toMatchObject({
      ...commandData,
      id: expect.any(String),
      password: expect.any(String),
      accountId: undefined,
    });
  });

  it('Should fail if the email is already in use', async () => {
    usersRepositoryMock.exists.mockReturnValue(true);

    const registerUserResult = await handler.execute(
      new RegisterUserCommand(commandData),
    );

    expect(registerUserResult.isSuccess).toBe(false);
    expect(registerUserResult.getErrorValue()).toBe('El usuario ya existe');
  });

  it('Should fail if it cannot create a user', async () => {
    jest.spyOn(handler as any, 'validate').mockReturnValueOnce(Result.ok());
    usersRepositoryMock.exists.mockReturnValue(false);

    const registerUserResult = await handler.execute(
      new RegisterUserCommand({ ...commandData, firstname: null }),
    );

    expect(registerUserResult.isSuccess).toBe(false);
  });

  it('Should fail if no firstname was provided', async () => {
    const registerUserResult = await handler.execute(
      new RegisterUserCommand({ ...commandData, firstname: null }),
    );

    expect(registerUserResult.isSuccess).toBe(false);
  });

  it('Should fail if no lastname was provided', async () => {
    const registerUserResult = await handler.execute(
      new RegisterUserCommand({ ...commandData, lastname: null }),
    );

    expect(registerUserResult.isSuccess).toBe(false);
  });

  it('Should fail if no email was provided', async () => {
    const registerUserResult = await handler.execute(
      new RegisterUserCommand({ ...commandData, email: null }),
    );

    expect(registerUserResult.isSuccess).toBe(false);
  });

  it('Should fail if no password was provided', async () => {
    const registerUserResult = await handler.execute(
      new RegisterUserCommand({ ...commandData, password: null }),
    );

    expect(registerUserResult.isSuccess).toBe(false);
  });
});

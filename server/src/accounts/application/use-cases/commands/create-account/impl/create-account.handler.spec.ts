import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateAccountHandler } from './create-account.handler';
import { AccountsRepository } from '@/accounts/infra/db/accounts.repository';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { CreateAccountCommand } from '../create-account.command';
import { Account } from '@/accounts/domain/entities/Account';
import { User } from '@/users/domain/entities/User';
import { Result } from '@/shared/core/Result';

const user = {
  id: 'asd',
  accountId: null,
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd',
};

describe('Create Account use case', () => {
  let handler: CreateAccountHandler;

  const usersRepositoryMock = {
    findOneById: jest.fn(),
  };

  const accountsRepositoryMock = {
    save: jest.fn(),
  };

  const commitFn = jest.spyOn(Account.prototype, 'commit').mockReturnThis();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        CreateAccountHandler,
        { provide: AccountsRepository, useValue: accountsRepositoryMock },
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    handler = module.get<CreateAccountHandler>(CreateAccountHandler);
  });

  afterEach(() => {
    usersRepositoryMock.findOneById.mockReset();
    accountsRepositoryMock.save.mockReset();
    commitFn.mockClear();
  });

  it('Should successfully create an account', async () => {
    usersRepositoryMock.findOneById.mockReturnValue(User.create(user));

    const commandData = {
      name: 'Test account',
      number: 1234,
      balance: 100,
      ownerId: 'asd',
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData),
    );

    expect(accountsRepositoryMock.save).toHaveBeenCalled();
    expect(commitFn).toHaveBeenCalled();
    expect(createAccountResult.isSuccess).toBe(true);

    const account = createAccountResult.getValue();

    expect(account).toMatchObject({
      id: expect.any(String),
      transactions: [],
      ...commandData,
    });
  });

  it('Should fail if the user does not exists', async () => {
    usersRepositoryMock.findOneById.mockReturnValue(
      Result.fail('Error al buscal al usuario'),
    );

    const commandData = {
      name: 'Test account',
      number: 1234,
      balance: 100,
      ownerId: 'asd',
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData),
    );

    expect(createAccountResult.isSuccess).toBe(false);
    expect(createAccountResult.getErrorValue()).toBe(
      'Error al buscal al usuario',
    );
  });

  it('Should fail if the user already has an account', async () => {
    usersRepositoryMock.findOneById.mockReturnValue(
      User.create({ ...user, accountId: 'xyz' }),
    );

    const commandData = {
      name: 'Test account',
      number: 1234,
      balance: 100,
      ownerId: 'asd',
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData),
    );

    expect(createAccountResult.isSuccess).toBe(false);
    expect(createAccountResult.getErrorValue()).toBe(
      'Ya tienes una cuenta creada',
    );
  });

  it('Should assign 0 on account balance if no balance was provided', async () => {
    usersRepositoryMock.findOneById.mockReturnValue(User.create(user));

    const commandData = {
      name: 'Test account',
      number: 1234,
      ownerId: 'asd',
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData),
    );
    const account = createAccountResult.getValue();

    expect(account.balance).toBe(0);
  });

  it('Should fail if it cannot create an account', async () => {
    usersRepositoryMock.findOneById.mockReturnValue(User.create(user));

    const commandData = {
      name: 'Test account',
      number: 1234,
      ownerId: 'asd',
      // Balance negativo hace fallar la creación de la cuenta
      balance: -200,
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData),
    );

    expect(createAccountResult.isSuccess).toBe(false);
  });

  it('Should fail if no name is provided', async () => {
    const commandData = {
      number: 1234,
      ownerId: 'asd',
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData as any),
    );

    expect(createAccountResult.isSuccess).toBe(false);
  });

  it('Should fail if no number is provided', async () => {
    const commandData = {
      name: 'Test account',
      ownerId: 'asd',
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData as any),
    );

    expect(createAccountResult.isSuccess).toBe(false);
  });

  it('Should fail if no ownerId is provided', async () => {
    const commandData = {
      name: 'Test account',
      number: 1234,
    };
    const createAccountResult = await handler.execute(
      new CreateAccountCommand(commandData as any),
    );

    expect(createAccountResult.isSuccess).toBe(false);
  });
});

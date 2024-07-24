import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';

import { User, UserPropsDTO } from '@/users/domain/entities/User';
import { AddTransactionHandler } from './add-transaction.handler';
import { Account, AccountPropsDTO } from '@/accounts/domain/entities/Account';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { AccountsRepository } from '@/accounts/infra/db/accounts.repository';
import { TransactionType } from '@/transactions/domain/entities/Transaction';
import { AddTransactionCommand } from '../add-transaction.command';
import { Result } from '@/shared/core/Result';

const user: UserPropsDTO = {
  id: 'abc',
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd123',
  accountId: 'xyz',
};

const account: AccountPropsDTO = {
  id: 'xyz',
  name: 'Test account',
  number: 12345,
  balance: 0,
  ownerId: 'abc',
  transactions: [],
};

const transactionData: AddTransactionCommand['data'] = {
  type: TransactionType.DEPOSIT,
  amount: 100,
  userId: user.id,
};

describe('Add Transaction use case', () => {
  let handler: AddTransactionHandler;

  const usersRepositoryMock = {
    findOneById: jest.fn().mockReturnValue(User.create(user)),
  };

  const accountsRepositoryMock = {
    findOneById: jest.fn().mockReturnValue(Account.create(account)),
    save: jest.fn(),
  };

  const commitFn = jest.spyOn(Account.prototype, 'commit').mockReturnThis();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AddTransactionHandler,
        { provide: UsersRepository, useValue: usersRepositoryMock },
        { provide: AccountsRepository, useValue: accountsRepositoryMock },
      ],
    }).compile();

    handler = module.get<AddTransactionHandler>(AddTransactionHandler);
  });

  afterEach(() => {
    usersRepositoryMock.findOneById.mockClear();
    accountsRepositoryMock.findOneById.mockClear();
    accountsRepositoryMock.save.mockReset();
    commitFn.mockClear();
  });

  it('Should successfully do a transaction', async () => {
    const addTransactionResult = await handler.execute(
      new AddTransactionCommand(transactionData),
    );

    const mockedAccount = accountsRepositoryMock.findOneById
      .getMockImplementation()()
      .getValue();

    expect(addTransactionResult.isSuccess).toBe(true);
    expect(commitFn).toHaveBeenCalled();
    expect(accountsRepositoryMock.save).toHaveBeenCalledWith(mockedAccount);

    const transaction = addTransactionResult.getValue();
    expect(transaction).toMatchObject({
      id: expect.any(String),
      amount: transactionData.amount,
      type: transactionData.type,
      accountId: account.id,
    });
  });

  it('Should fail if cannot find the user', async () => {
    usersRepositoryMock.findOneById.mockReturnValueOnce(Result.fail('Error'));

    const addTransactionResult = await handler.execute(
      new AddTransactionCommand(transactionData),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });

  it('Should fail if the user has not an account', async () => {
    usersRepositoryMock.findOneById.mockReturnValueOnce(
      User.create({ ...user, accountId: null }),
    );

    const addTransactionResult = await handler.execute(
      new AddTransactionCommand(transactionData),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
    expect(addTransactionResult.getErrorValue()).toBe(
      'No tienes una cuenta creada',
    );
  });

  it('Should fail if cannot create the transaction', async () => {
    const addTransactionResult = await handler.execute(
      new AddTransactionCommand({ ...transactionData, amount: -100 }),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });

  it('Should fail if cannot find the account', async () => {
    accountsRepositoryMock.findOneById.mockReturnValueOnce(
      Result.fail('Error'),
    );

    const addTransactionResult = await handler.execute(
      new AddTransactionCommand(transactionData),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });

  it('Should fail if cannot add the transaction to the account', async () => {
    const addTransactionResult = await handler.execute(
      new AddTransactionCommand({
        ...transactionData,
        amount: 1000,
        type: TransactionType.WITHDRAWAL,
      }),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });

  it('Should fail if amount was not provided', async () => {
    const addTransactionResult = await handler.execute(
      new AddTransactionCommand({
        ...transactionData,
        amount: null,
      }),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });

  it('Should fail if type was not provided', async () => {
    const addTransactionResult = await handler.execute(
      new AddTransactionCommand({
        ...transactionData,
        type: null,
      }),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });

  it('Should fail if userId was not provided', async () => {
    const addTransactionResult = await handler.execute(
      new AddTransactionCommand({
        ...transactionData,
        userId: null,
      }),
    );

    expect(addTransactionResult.isSuccess).toBe(false);
  });
});

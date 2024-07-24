import { Test } from '@nestjs/testing';
import { GetAccountHandler } from './get-account.handler';
import { AccountsRepository } from '@/accounts/infra/db/accounts.repository';
import { Account } from '@/accounts/domain/entities/Account';
import { GetAccountQuery } from '../get-account.query';
import { Result } from '@/shared/core/Result';

describe('Get Account Handler', () => {
  let handler: GetAccountHandler;

  const accountsRepositoryMock = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAccountHandler,
        { provide: AccountsRepository, useValue: accountsRepositoryMock },
      ],
    }).compile();

    handler = module.get<GetAccountHandler>(GetAccountHandler);
  });

  afterEach(() => {
    accountsRepositoryMock.findOneById.mockReset();
  });

  it('Should successfully return an account', async () => {
    const account = Account.create({
      id: 'asd',
      balance: 100,
      name: 'Test account',
      number: 12345,
      ownerId: 'xyz',
      transactions: [],
    });

    accountsRepositoryMock.findOneById.mockReturnValue(account);

    const getAccountResult = await handler.execute(
      new GetAccountQuery({
        accountId: 'asd',
      }),
    );

    expect(accountsRepositoryMock.findOneById).toHaveBeenCalled();
    expect(getAccountResult.isSuccess).toBe(true);

    const accountDTO = getAccountResult.getValue();
    expect(accountDTO).toMatchObject(account.getValue().toDTO());
  });

  it('Should fail if the account does not exist', async () => {
    accountsRepositoryMock.findOneById.mockReturnValue(
      Result.fail('Error al buscar la cuenta'),
    );

    const getAccountResult = await handler.execute(
      new GetAccountQuery({
        accountId: 'asd',
      }),
    );

    expect(getAccountResult.isSuccess).toBe(false);
    expect(getAccountResult.getErrorValue()).toBe('Error al buscar la cuenta');
  });

  it('Should fail if no account id was provided', async () => {
    const getAccountResult = await handler.execute(
      new GetAccountQuery({} as any),
    );

    expect(getAccountResult.isSuccess).toBe(false);
  });
});

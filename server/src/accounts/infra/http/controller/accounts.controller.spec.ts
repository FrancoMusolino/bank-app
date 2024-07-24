import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountsController } from './accounts.controller';
import { GetAccountQuery } from '@/accounts/application/use-cases/queries/get-account/get-account.query';
import { Result } from '@/shared/core/Result';
import { Account } from '@/accounts/domain/entities/Account';
import { HttpException } from '@nestjs/common';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { CreateAccountCommand } from '@/accounts/application/use-cases/commands/create-account/create-account.command';

const user = { id: 'asd' };

describe('AccountsController', () => {
  let controller: AccountsController;
  let busMock = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: QueryBus, useValue: busMock },
        { provide: CommandBus, useValue: busMock },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  afterEach(() => {
    busMock.execute.mockReset();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return the account info if get account is success', async () => {
    const account = Account.create({
      id: '123',
      balance: 0,
      name: 'Test account',
      number: 1234,
      ownerId: user.id,
      transactions: [],
    }).getValue();

    busMock.execute.mockResolvedValueOnce(Result.ok(account.toDTO()));
    const res = await controller.getAccount('asd');

    expect(busMock.execute).toHaveBeenCalledWith(
      new GetAccountQuery({ accountId: 'asd' }),
    );
    expect(res).toMatchObject(account.toDTO());
  });

  it('Should throw if get account is failure', async () => {
    busMock.execute.mockResolvedValueOnce(Result.fail('La cuenta no existe'));

    await expect(controller.getAccount('asd')).rejects.toThrowError(
      HttpException,
    );
  });

  it('Should return the account id on success account creation', async () => {
    const dto: CreateAccountDto = {
      name: 'Test account',
      number: 1234,
    };

    const account = Account.create({
      id: '123',
      balance: 0,
      name: 'Test account',
      number: 1234,
      ownerId: 'asd',
      transactions: [],
    }).getValue();
    busMock.execute.mockResolvedValueOnce(Result.ok(account.toDTO()));

    const res = await controller.createAccount({ user } as any, dto);

    expect(busMock.execute).toHaveBeenCalledWith(
      new CreateAccountCommand({
        ...dto,
        ownerId: user.id,
      }),
    );
    expect(res).toMatchObject({ accountId: account.getId() });
  });

  it('Should throw if create account is failure', async () => {
    const dto: CreateAccountDto = {
      name: 'Test account',
      number: 1234,
    };

    busMock.execute.mockResolvedValueOnce(Result.fail('Error'));
    await expect(
      controller.createAccount({ user } as any, dto),
    ).rejects.toThrowError(HttpException);
  });
});

import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { TransactionsController } from './transactions.controller';
import { AddTransactionDto } from '../dtos/add-transaction.dto';
import {
  TransactionPropsDTO,
  TransactionType,
} from '@/transactions/domain/entities/Transaction';
import { AddTransactionCommand } from '@/transactions/application/use-cases/commands/add-transaction/add-transaction.command';
import { Result } from '@/shared/core/Result';

const user = { id: 'asd' };

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let busMock = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: CommandBus, useValue: busMock }],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterEach(() => {
    busMock.execute.mockReset();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return a message if the transaction was succed', async () => {
    const dto: AddTransactionDto = {
      amount: 10000,
      type: TransactionType.DEPOSIT,
    };

    busMock.execute.mockResolvedValueOnce(Result.ok({} as TransactionPropsDTO));
    const res = await controller.addTransaction({ user } as any, dto);

    expect(busMock.execute).toHaveBeenCalledWith(
      new AddTransactionCommand({ ...dto, userId: user.id }),
    );
    expect(res).toMatchObject({ message: 'Transacción exitosa' });
  });

  it('Should throw an error if the transaction fail', async () => {
    const dto: AddTransactionDto = {
      amount: 10000,
      type: TransactionType.DEPOSIT,
    };

    busMock.execute.mockResolvedValueOnce(Result.fail('Error'));

    await expect(
      controller.addTransaction({ user } as any, dto),
    ).rejects.toThrowError(HttpException);
  });
});

import { TransactionType } from '@/transactions/domain/entities/Transaction';
import { LargeAmountLoggerMiddleware } from './large-amount-logger.middleware';
import { Request, Response } from 'express';

const middleware = new LargeAmountLoggerMiddleware();

describe('LargeAmountLogger Middleware', () => {
  const next = jest.fn();
  const consoleSpy = jest.spyOn(console, 'log');

  afterEach(() => {
    next.mockReset();
    consoleSpy.mockReset();
  });

  it('Should call console.log if the amount is greater than 10.000 US$ and the transaction type is a deposit', () => {
    const req = {
      body: {
        // Monto en centavos
        amount: 10_000_000,
        type: TransactionType.DEPOSIT,
      },
    };

    middleware.use(req as Request, {} as Response, next);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Se registró un depósito de más de 10.000 US$.',
    );
    expect(next).toHaveBeenCalled();
  });

  it('Should not call console.log if the amount is less than 10.000 US$', () => {
    const req = {
      body: {
        amount: 100,
        type: TransactionType.DEPOSIT,
      },
    };

    middleware.use(req as Request, {} as Response, next);

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('Should not call console.log if the transaction is a withdrawal', () => {
    const req = {
      body: {
        amount: 10_000_000,
        type: TransactionType.WITHDRAWAL,
      },
    };

    middleware.use(req as Request, {} as Response, next);

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

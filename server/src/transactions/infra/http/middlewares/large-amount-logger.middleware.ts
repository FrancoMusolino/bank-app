import { TransactionType } from '@/transactions/domain/entities/Transaction';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LargeAmountLoggerMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const { type, amount } = req.body;

    // Los montos se manejan en centavos
    if (+amount > 10_000 * 100 && type === TransactionType.DEPOSIT) {
      console.log('Se registró un depósito de más de 10.000 US$.');
    }

    next();
  }
}

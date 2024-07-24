import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';

import { JwtPayload } from '@/auth/infra/jwt/jwt.strategy';
import { AddTransactionDto } from '../dtos/add-transaction.dto';
import { AddTransactionCommand } from '@/transactions/application/use-cases/commands/add-transaction/add-transaction.command';
import { Result } from '@/shared/core/Result';
import { TransactionPropsDTO } from '@/transactions/domain/entities/Transaction';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async addTransaction(
    @Req() { user }: Request & { user: JwtPayload },
    @Body() transaction: AddTransactionDto,
  ) {
    const addTransactionResult = await this.commandBus.execute<
      AddTransactionCommand,
      Result<TransactionPropsDTO>
    >(new AddTransactionCommand({ ...transaction, userId: user.id }));

    if (addTransactionResult.isFailure) {
      throw new BadRequestException(addTransactionResult.getErrorValue());
    }

    return {
      message: 'Transacción exitosa',
    };
  }
}

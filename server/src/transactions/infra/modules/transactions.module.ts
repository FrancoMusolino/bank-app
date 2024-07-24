import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TransactionsController } from '../http/controller/transactions.controller';
import { CommandHandlers } from '@/transactions/application/use-cases/commands';
import { UsersModule } from '@/users/infra/modules/users.module';
import { AccountsModule } from '@/accounts/infra/modules/accounts.module';
import { LargeAmountLoggerMiddleware } from '../http/middlewares/large-amount-logger.middleware';

@Module({
  imports: [CqrsModule, UsersModule, AccountsModule],
  controllers: [TransactionsController],
  providers: [...CommandHandlers],
})
export class TransactionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LargeAmountLoggerMiddleware)
      .forRoutes({ path: 'transactions', method: RequestMethod.POST });
  }
}

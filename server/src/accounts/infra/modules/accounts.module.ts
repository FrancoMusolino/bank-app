import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandHandlers } from '@/accounts/application/use-cases/commands';
import { AccountsController } from '../http/controller/accounts.controller';
import { UsersModule } from '@/users/infra/modules/users.module';
import { AccountsRepository } from '../db/accounts.repository';
import { QueryHandlers } from '@/accounts/application/use-cases/queries';

@Module({
  imports: [CqrsModule, UsersModule],
  controllers: [AccountsController],
  providers: [AccountsRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [AccountsRepository],
})
export class AccountsModule {}

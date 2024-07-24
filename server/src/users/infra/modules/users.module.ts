import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandHandlers } from '@/users/application/use-cases/commands';
import { UsersRepository } from '../db/users.repository';
import { EventHandlers } from '@/users/application/use-cases/event-handlers';

@Module({
  imports: [CqrsModule],
  providers: [UsersRepository, ...CommandHandlers, ...EventHandlers],
  exports: [UsersRepository],
})
export class UsersModule {}

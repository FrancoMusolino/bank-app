import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AccountCreatedEvent } from '@/accounts/domain/events/account-created.event';
import { UsersRepository } from '@/users/infra/db/users.repository';

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler
  implements IEventHandler<AccountCreatedEvent>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly usersRepository: UsersRepository,
  ) {}

  handle(event: AccountCreatedEvent) {
    const { data: account } = event;

    const userOrError = this.usersRepository.findOneById(account.ownerId);
    if (userOrError.isFailure) {
      console.log('Unable to connect account to user');
      console.log({ error: userOrError.getErrorValue() });

      return;
    }
    const user = this.publisher.mergeObjectContext(userOrError.getValue());

    const connectAccountResult = user.connectAccount(account.id);
    if (connectAccountResult.isFailure) {
      console.log('Unable to connect account to user');
      console.log({ error: connectAccountResult.getErrorValue() });

      return;
    }

    this.usersRepository.save(user);
    user.commit();
  }
}

import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';

type AccountCreatedEventData = {
  id: string;
  name: string;
  number: number;
  balance: number;
  ownerId: string;
};

export class AccountCreatedEvent
  implements IDomainEvent<AccountCreatedEventData>
{
  type: string = 'AccountCreated';
  aggregateId: string;
  data: AccountCreatedEventData;

  constructor(data: AccountCreatedEventData) {
    this.data = data;
    this.aggregateId = data.id;
  }
}

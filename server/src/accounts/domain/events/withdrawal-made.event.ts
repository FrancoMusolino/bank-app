import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';

type WithdrawalMadeEventData = {
  transactionId: string;
  accountId: string;
  amount: number;
};

export class WithdrawalMadeEvent
  implements IDomainEvent<WithdrawalMadeEventData>
{
  type: string = 'WithdrawalMade';
  aggregateId: string;
  data: WithdrawalMadeEventData;

  constructor(data: WithdrawalMadeEventData) {
    this.data = data;
    this.aggregateId = data.accountId;
  }
}

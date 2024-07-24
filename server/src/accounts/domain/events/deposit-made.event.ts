import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';

type DepositMadeEventData = {
  transactionId: string;
  accountId: string;
  amount: number;
};

export class DepositMadeEvent implements IDomainEvent<DepositMadeEventData> {
  type: string = 'DepositMade';
  aggregateId: string;
  data: DepositMadeEventData;

  constructor(data: DepositMadeEventData) {
    this.data = data;
    this.aggregateId = data.accountId;
  }
}

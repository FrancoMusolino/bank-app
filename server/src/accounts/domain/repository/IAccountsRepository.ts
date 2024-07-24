import { Repository } from '@/shared/db/repository';
import { Account } from '../entities/Account';
import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';

export interface IAccountsRepository extends Repository<Account> {
  getAggregateEvents(aggregateId: string): IDomainEvent<any>[];
}

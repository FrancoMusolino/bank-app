import { Injectable } from '@nestjs/common';

import { Account } from '@/accounts/domain/entities/Account';
import { Result } from '@/shared/core/Result';
import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';
import { IAccountsRepository } from '@/accounts/domain/repository/IAccountsRepository';

@Injectable()
export class AccountsRepository implements IAccountsRepository {
  private eventStreams: Map<string, IDomainEvent<any>[]> = new Map();

  findOneById(id: string): Result<Account> {
    const aggregateEvents = this.getAggregateEvents(id);
    if (!aggregateEvents.length) {
      return Result.fail('No se ha encontrado la cuenta');
    }

    return Account.applyEvents(aggregateEvents);
  }

  getAggregateEvents(aggregateId: string): IDomainEvent<any>[] {
    const aggregateEvents = this.eventStreams.get(
      this.getStreamName(aggregateId),
    );

    return aggregateEvents ?? [];
  }

  save(account: Account): void {
    const accountId = account.getId();

    this.createAggregateStreamIfNotExists(accountId);
    const stream = this.getAggregateEvents(accountId);

    const events = account.getUncommittedEvents() as IDomainEvent<any>[];
    events.forEach((event) => stream.push(event));
  }

  private createAggregateStreamIfNotExists(aggregateId: string) {
    const streamName = this.getStreamName(aggregateId);

    if (!this.eventStreams.has(streamName)) {
      this.eventStreams.set(streamName, []);
    }
  }

  private getStreamName(aggregateId: string) {
    return `account-${aggregateId}`;
  }
}

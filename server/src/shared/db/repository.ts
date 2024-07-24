import { AggregateRoot } from '@nestjs/cqrs';
import { Result } from '../core/Result';

export interface Repository<T extends AggregateRoot> {
  findOneById(id: string): Result<T>;
  save(aggregate: T): void;
}

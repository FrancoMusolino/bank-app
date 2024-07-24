export interface IDomainEvent<T extends object> {
  type: string;
  aggregateId: string;
  data: T;
}

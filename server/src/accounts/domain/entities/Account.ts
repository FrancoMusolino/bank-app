import { AggregateRoot } from '@nestjs/cqrs';

import { Result } from '@/shared/core/Result';
import { Validate } from '@/shared/core/Validate';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityID';
import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';
import { Currency, Money } from './Money';
import {
  Transaction,
  TransactionPropsDTO,
  TransactionType,
} from '@/transactions/domain/entities/Transaction';

import { AccountCreatedEvent } from '../events/account-created.event';
import { DepositMadeEvent } from '../events/deposit-made.event';
import { WithdrawalMadeEvent } from '../events/withdrawal-made.event';

export type AccountProps = {
  id: UniqueEntityID;
  name: string;
  number: number;
  balance: Money;
  ownerId: UniqueEntityID;
  transactions: Transaction[];
};

export type AccountPropsDTO = {
  id: string;
  name: string;
  number: number;
  balance: number;
  ownerId: string;
  transactions: TransactionPropsDTO[];
};

export class Account extends AggregateRoot {
  private constructor(private props: AccountProps) {
    super();
  }

  getId(): string {
    return this.props.id.toString();
  }

  getBalance(): number {
    return this.props.balance.getCents();
  }

  getTransactions(): TransactionPropsDTO[] {
    return this.props.transactions.map((transaction) => transaction.toDTO());
  }

  static create(props: Partial<AccountPropsDTO>): Result<Account> {
    const guardResult = Validate.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.number, argumentName: 'number' },
      { argument: props.balance, argumentName: 'balance' },
      { argument: props.ownerId, argumentName: 'ownerId' },
    ]);
    if (guardResult.isFailure) {
      return Result.fail<Account>(guardResult.getErrorValue());
    }

    const idWasProvided = !!props.id;

    const validateBalance = Validate.isGreaterOrEqualThan(
      props.balance,
      0,
      'balance',
    );
    if (validateBalance.isFailure) {
      return Result.fail(validateBalance.getErrorValue());
    }

    const balance = Money.fromCents(props.balance, Currency.USD);

    const transactions = [];
    for (const transaction of props.transactions ?? []) {
      const transactionOrError = Transaction.create(transaction);
      if (transactionOrError.isFailure) {
        return Result.fail(transactionOrError.getErrorValue());
      }
      transactions.push(transactionOrError.getValue());
    }

    const account = new Account({
      id: new UniqueEntityID(props.id),
      name: props.name,
      number: props.number,
      balance,
      ownerId: new UniqueEntityID(props.ownerId),
      transactions,
    });

    if (!idWasProvided) {
      account.apply(new AccountCreatedEvent(account.toDTO()));
    }

    return Result.ok<Account>(account);
  }

  static applyEvents(events: IDomainEvent<any>[]): Result<Account> {
    let account: Account;

    for (const event of events) {
      if (event.type === 'AccountCreated') {
        account = Account.create(event.data).getValue();
      }

      if (!account) {
        return Result.fail('Error al realizar la proyección de la cuenta');
      }

      if (event.type === 'WithdrawalMade') {
        const transaction = Transaction.create({
          ...event.data,
          id: event.data.transactionId,
          type: TransactionType.WITHDRAWAL,
        }).getValue();

        account.withdraw(transaction);
      }

      if (event.type === 'DepositMade') {
        const transaction = Transaction.create({
          ...event.data,
          id: event.data.transactionId,
          type: TransactionType.DEPOSIT,
        }).getValue();

        account.deposit(transaction);
      }
    }

    return Result.ok(account);
  }

  addTransaction(transaction: Transaction): Result<string> {
    let operationResult:
      | ReturnType<typeof this.withdraw>
      | ReturnType<typeof this.deposit>;

    const eventData = {
      transactionId: transaction.getId(),
      amount: transaction.getAmount(),
      accountId: this.getId(),
    };

    switch (transaction.getType()) {
      case TransactionType.WITHDRAWAL: {
        operationResult = this.withdraw(transaction);
        this.apply(new WithdrawalMadeEvent(eventData));
        break;
      }
      case TransactionType.DEPOSIT: {
        operationResult = this.deposit(transaction);
        this.apply(new DepositMadeEvent(eventData));
        break;
      }
      default:
        return Result.fail('Unknown operation');
    }

    if (operationResult.isFailure) {
      return Result.fail(operationResult.getErrorValue());
    }

    return Result.ok(operationResult.getValue());
  }

  private withdraw(transaction: Transaction): Result<string> {
    if (!this.hasEnoughBalance(transaction.getAmount())) {
      return Result.fail('Saldo insuficiente');
    }

    this.props.balance = Money.fromCents(
      this.props.balance.getCents() - transaction.getAmount(),
      this.props.balance.getCurrency(),
    );

    this.props.transactions.push(transaction);

    return Result.ok('Retiro exitoso');
  }

  private deposit(transaction: Transaction): Result<string> {
    this.props.balance = Money.fromCents(
      this.props.balance.getCents() + transaction.getAmount(),
      this.props.balance.getCurrency(),
    );

    this.props.transactions.push(transaction);

    return Result.ok('Depósito exitoso');
  }

  private hasEnoughBalance(amount: number): boolean {
    return this.props.balance.getCents() >= amount;
  }

  toDTO(): AccountPropsDTO {
    return {
      ...this.props,
      id: this.getId(),
      balance: this.getBalance(),
      ownerId: this.props.ownerId.toString(),
      transactions: this.getTransactions(),
    };
  }
}

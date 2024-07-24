import { Currency, Money } from '@/accounts/domain/entities/Money';
import { Result } from '@/shared/core/Result';
import { Validate } from '@/shared/core/Validate';
import { Entity } from '@/shared/domain/Entity';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityID';

export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
}

type TransactionProps = {
  type: TransactionType;
  amount: Money;
  accountId: UniqueEntityID;
};

export type TransactionPropsDTO = {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
};

export class Transaction extends Entity<TransactionProps> {
  private constructor(props: TransactionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  getId(): string {
    return this._id.toString();
  }

  getType(): TransactionType {
    return this.props.type;
  }

  getAmount(): number {
    return this.props.amount.getCents();
  }

  static create(props: Partial<TransactionPropsDTO>): Result<Transaction> {
    const guardResult = Validate.againstNullOrUndefinedBulk([
      { argument: props.type, argumentName: 'type' },
      { argument: props.amount, argumentName: 'amount' },
      { argument: props.accountId, argumentName: 'accountId' },
    ]);
    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    const validateAmount = Validate.isGreaterThan(props.amount, 0, 'amount');
    if (validateAmount.isFailure) {
      return Result.fail(validateAmount.getErrorValue());
    }

    const amount = Money.fromCents(props.amount, Currency.USD);

    const transaction = new Transaction(
      {
        type: props.type,
        amount,
        accountId: new UniqueEntityID(props.accountId),
      },
      new UniqueEntityID(props.id),
    );

    return Result.ok<Transaction>(transaction);
  }

  toDTO(): TransactionPropsDTO {
    return {
      ...this.props,
      id: this.getId(),
      amount: this.props.amount.getCents(),
      accountId: this.props.accountId.toString(),
    };
  }
}

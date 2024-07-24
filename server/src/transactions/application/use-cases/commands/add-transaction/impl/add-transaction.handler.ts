import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { AddTransactionCommand } from '../add-transaction.command';

import { Validate } from '@/shared/core/Validate';
import { Result } from '@/shared/core/Result';
import { AccountsRepository } from '@/accounts/infra/db/accounts.repository';
import { UsersRepository } from '@/users/infra/db/users.repository';
import {
  Transaction,
  TransactionPropsDTO,
} from '@/transactions/domain/entities/Transaction';

@CommandHandler(AddTransactionCommand)
export class AddTransactionHandler
  implements
    ICommandHandler<AddTransactionCommand, Result<TransactionPropsDTO>>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly usersRepository: UsersRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  async execute(
    command: AddTransactionCommand,
  ): Promise<Result<TransactionPropsDTO>> {
    const validate = this.validate(command);
    if (validate.isFailure) {
      return Result.fail(validate.getErrorValue());
    }

    const { data } = command;

    const userOrError = this.usersRepository.findOneById(data.userId);
    if (userOrError.isFailure) {
      return Result.fail(userOrError.getErrorValue());
    }
    const user = userOrError.getValue();

    if (!user.hasAccount()) {
      return Result.fail('No tienes una cuenta creada');
    }

    const accountId = user.getAccount();

    const transactionOrError = Transaction.create({
      type: data.type,
      amount: data.amount,
      accountId,
    });
    if (transactionOrError.isFailure) {
      return Result.fail(transactionOrError.getErrorValue());
    }
    const transaction = transactionOrError.getValue();

    const accountOrError = this.accountsRepository.findOneById(accountId);
    if (accountOrError.isFailure) {
      return Result.fail(accountOrError.getErrorValue());
    }
    const account = this.publisher.mergeObjectContext(
      accountOrError.getValue(),
    );

    const addTransactionResult = account.addTransaction(transaction);
    if (addTransactionResult.isFailure) {
      return Result.fail(addTransactionResult.getErrorValue());
    }

    this.accountsRepository.save(account);
    account.commit();

    return Result.ok(transaction.toDTO());
  }

  private validate(command: AddTransactionCommand) {
    const validation = Validate.isRequiredBulk([
      { argument: command.data.amount, argumentName: 'amount' },
      { argument: command.data.type, argumentName: 'type' },
      { argument: command.data.userId, argumentName: 'userId' },
    ]);

    if (!validation.success) {
      return Result.fail<string>(validation.message);
    }

    return Result.ok();
  }
}

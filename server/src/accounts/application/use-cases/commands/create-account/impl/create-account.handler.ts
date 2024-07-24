import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { CreateAccountCommand } from '../create-account.command';

import { Validate } from '@/shared/core/Validate';
import { Result } from '@/shared/core/Result';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { Account, AccountPropsDTO } from '@/accounts/domain/entities/Account';
import { AccountsRepository } from '@/accounts/infra/db/accounts.repository';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, Result<AccountPropsDTO>>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly accountsRepository: AccountsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    command: CreateAccountCommand,
  ): Promise<Result<AccountPropsDTO>> {
    const validate = this.validate(command);
    if (validate.isFailure) {
      return Result.fail(validate.getErrorValue());
    }

    const { data } = command;

    const userOrError = this.usersRepository.findOneById(data.ownerId);
    if (userOrError.isFailure) {
      return Result.fail(userOrError.getErrorValue());
    }
    const user = userOrError.getValue();

    if (user.hasAccount()) {
      return Result.fail('Ya tienes una cuenta creada');
    }

    const accountOrError = Account.create({
      ...data,
      balance: data.balance ?? 0,
    });
    if (accountOrError.isFailure) {
      return Result.fail(accountOrError.getErrorValue());
    }
    const account = this.publisher.mergeObjectContext(
      accountOrError.getValue(),
    );

    this.accountsRepository.save(account);
    account.commit();

    return Result.ok(account.toDTO());
  }

  private validate(command: CreateAccountCommand) {
    const validation = Validate.isRequiredBulk([
      { argument: command.data.name, argumentName: 'name' },
      { argument: command.data.number, argumentName: 'number' },
      { argument: command.data.ownerId, argumentName: 'ownerId' },
    ]);

    if (!validation.success) {
      return Result.fail<string>(validation.message);
    }

    return Result.ok();
  }
}

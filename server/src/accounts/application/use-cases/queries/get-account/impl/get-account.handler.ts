import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAccountQuery } from '../get-account.query';

import { Validate } from '@/shared/core/Validate';
import { Result } from '@/shared/core/Result';
import { AccountPropsDTO } from '@/accounts/domain/entities/Account';
import { AccountsRepository } from '@/accounts/infra/db/accounts.repository';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler
  implements IQueryHandler<GetAccountQuery, Result<AccountPropsDTO>>
{
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async execute(command: GetAccountQuery): Promise<Result<AccountPropsDTO>> {
    const validate = this.validate(command);
    if (validate.isFailure) {
      return Result.fail(validate.getErrorValue());
    }

    const { data } = command;

    const accountOrError = this.accountsRepository.findOneById(data.accountId);
    if (accountOrError.isFailure) {
      return Result.fail(accountOrError.getErrorValue());
    }
    const account = accountOrError.getValue();

    return Result.ok(account.toDTO());
  }

  private validate(command: GetAccountQuery) {
    const validation = Validate.isRequiredBulk([
      { argument: command.data.accountId, argumentName: 'accountId' },
    ]);

    if (!validation.success) {
      return Result.fail<string>(validation.message);
    }

    return Result.ok();
  }
}

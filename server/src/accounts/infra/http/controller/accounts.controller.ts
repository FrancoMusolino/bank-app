import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';

import { CreateAccountDto } from '../dtos/create-account.dto';
import { JwtPayload } from '@/auth/infra/jwt/jwt.strategy';
import { CreateAccountCommand } from '@/accounts/application/use-cases/commands/create-account/create-account.command';
import { Result } from '@/shared/core/Result';
import { AccountPropsDTO } from '@/accounts/domain/entities/Account';
import { GetAccountQuery } from '@/accounts/application/use-cases/queries/get-account/get-account.query';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':accountId')
  async getAccount(@Param('accountId') accountId: string) {
    const getAccountResult = await this.queryBus.execute<
      GetAccountQuery,
      Result<AccountPropsDTO>
    >(
      new GetAccountQuery({
        accountId,
      }),
    );

    if (getAccountResult.isFailure) {
      throw new NotFoundException(getAccountResult.getErrorValue());
    }

    return getAccountResult.getValue();
  }

  @Post()
  async createAccount(
    @Req() { user }: Request & { user: JwtPayload },
    @Body() data: CreateAccountDto,
  ) {
    const createAccountResult = await this.commandBus.execute<
      CreateAccountCommand,
      Result<AccountPropsDTO>
    >(
      new CreateAccountCommand({
        ...data,
        ownerId: user.id,
      }),
    );

    if (createAccountResult.isFailure) {
      throw new BadRequestException(createAccountResult.getErrorValue());
    }

    const account = createAccountResult.getValue();

    return { accountId: account.id };
  }
}

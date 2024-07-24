import { AggregateRoot } from '@nestjs/cqrs';

import { Result } from '@/shared/core/Result';
import { Validate } from '@/shared/core/Validate';
import { UniqueEntityID } from '@/shared/domain/UniqueEntityID';
import { Password } from './Password';
import { Email } from './Email';

import { UserRegisteredEvent } from '../events/user-registered.event';
import { AccountConnectedEvent } from '../events/account-connected.event';

export type UserProps = {
  id: UniqueEntityID;
  firstname: string;
  lastname: string;
  email: Email;
  password: Password;
  accountId?: UniqueEntityID;
};

export type UserPropsDTO = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  accountId?: string;
};

export class User extends AggregateRoot {
  private constructor(private props: UserProps) {
    super();
  }

  getId(): string {
    return this.props.id.toString();
  }

  getAccount(): string | undefined {
    return this.props.accountId?.toString();
  }

  static create(props: Partial<UserPropsDTO>): Result<User> {
    const guardResult = Validate.againstNullOrUndefinedBulk([
      { argument: props.firstname, argumentName: 'firstname' },
      { argument: props.lastname, argumentName: 'lastname' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.password, argumentName: 'password' },
    ]);
    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const idWasProvided = !!props.id;

    const passwordOrError = Password.create({ value: props.password });
    if (passwordOrError.isFailure) {
      return Result.fail(passwordOrError.getErrorValue());
    }
    const password = passwordOrError.getValue();

    const emailOrError = Email.create({ value: props.email });
    if (emailOrError.isFailure) {
      return Result.fail(emailOrError.getErrorValue());
    }
    const email = emailOrError.getValue();

    const user = new User({
      id: new UniqueEntityID(props.id),
      firstname: props.firstname,
      lastname: props.lastname,
      email,
      password,
      accountId: props.accountId && new UniqueEntityID(props.accountId),
    });

    if (!idWasProvided) {
      user.apply(new UserRegisteredEvent(user.toDTO()));
    }

    return Result.ok<User>(user);
  }

  async validateCredentials(plainPassword: string): Promise<boolean> {
    const isValid = await this.props.password.compare(plainPassword);

    return isValid;
  }

  connectAccount(accountId: string): Result<string> {
    if (this.hasAccount()) {
      return Result.fail('Ya tienes una cuenta asociada');
    }

    this.props.accountId = new UniqueEntityID(accountId);
    this.apply(new AccountConnectedEvent({ userId: this.getId(), accountId }));

    return Result.ok('Cuenta asociada con el usuario');
  }

  hasAccount(): boolean {
    return !!this.props.accountId;
  }

  toDTO(): UserPropsDTO {
    return {
      ...this.props,
      id: this.getId(),
      email: this.props.email.getValue(),
      password: this.props.password.getValue(),
      accountId: this.getAccount(),
    };
  }
}

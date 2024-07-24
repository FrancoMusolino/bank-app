import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { RegisterUserCommand } from '../register-user.command';

import { Validate } from '@/shared/core/Validate';
import { Result } from '@/shared/core/Result';
import { User, UserPropsDTO } from '@/users/domain/entities/User';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { Password } from '@/users/domain/entities/Password';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, Result<UserPropsDTO>>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: RegisterUserCommand): Promise<Result<UserPropsDTO>> {
    const validate = this.validate(command);
    if (validate.isFailure) {
      return Result.fail(validate.getErrorValue());
    }

    const { data } = command;

    const mailInUse = this.usersRepository.exists(data.email);
    if (mailInUse) {
      return Result.fail('El usuario ya existe');
    }

    const userOrError = User.create({
      ...data,
      password: Password.hash(data.password),
    });
    if (userOrError.isFailure) {
      return Result.fail(userOrError.getErrorValue());
    }
    const user = this.publisher.mergeObjectContext(userOrError.getValue());

    this.usersRepository.save(user);
    user.commit();

    return Result.ok(user.toDTO());
  }

  private validate(command: RegisterUserCommand) {
    const validation = Validate.isRequiredBulk([
      { argument: command.data.firstname, argumentName: 'firstname' },
      { argument: command.data.lastname, argumentName: 'lastname' },
      { argument: command.data.email, argumentName: 'email' },
      { argument: command.data.password, argumentName: 'password' },
    ]);

    if (!validation.success) {
      return Result.fail<string>(validation.message);
    }

    return Result.ok();
  }
}

import { isEmail } from 'class-validator';

import { Result } from '@/shared/core/Result';
import { Validate } from '@/shared/core/Validate';
import { ValueObject } from '@/shared/domain/ValueObject';

type EmailProps = {
  value: string;
};

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  static create(props: EmailProps): Result<Email> {
    const guardResult = Validate.againstNullOrUndefined(props.value, 'email');
    if (!guardResult.isSuccess) {
      return Result.fail(guardResult.getErrorValue());
    }

    const emailValidation = Email.validate(props.value);
    if (emailValidation.isFailure) {
      return Result.fail(emailValidation.getErrorValue());
    }

    return Result.ok(new Email(props));
  }

  static validate(email: string): Result<string> {
    if (!isEmail(email)) {
      return Result.fail('El email es inválido');
    }

    return Result.ok('Email válido');
  }
}

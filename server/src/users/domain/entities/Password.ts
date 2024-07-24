import * as bcrypt from 'bcrypt';

import { Validate } from '@/shared/core/Validate';
import { Result } from '@/shared/core/Result';
import { ValueObject } from '@/shared/domain/ValueObject';

export type PasswordProps = {
  value: string;
};

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  getValue(): string {
    return this.props.value;
  }

  static create(props: PasswordProps): Result<Password> {
    const guardResult = Validate.combine([
      Validate.againstNullOrUndefined(props.value, 'password'),
      Validate.againstAtLeast(1, props.value ?? ''),
    ]);
    if (guardResult.isFailure) {
      return Result.fail(guardResult.getErrorValue());
    }

    const password = new Password({
      value: props.value,
    });

    return Result.ok<Password>(password);
  }

  static hash(plain: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(plain, salt);

    return hashed;
  }

  compare(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.getValue());
  }
}

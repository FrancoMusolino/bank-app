import { Result } from './Result';

export type ValidateResult = {
  message?: string;
  success: boolean;
};

export type ValidateArgument = {
  argument: any;
  argumentName: string;
};

export type ValidateResponse = string;
export type ValidateArgumentCollection = ValidateArgument[];

export const isEmpty = (argument: any): boolean => {
  return argument === null || argument === undefined || argument === '';
};

export const isNullOrUndefined = (argument: any): boolean => {
  return argument === null || argument === undefined;
};

export class Validate {
  static combine(guardResults: Result<any>[]): Result<ValidateResult> {
    for (let result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok<ValidateResult>();
  }

  static isRequired(argument: any, argumentName: string): ValidateResult {
    if (!isEmpty(argument)) return { success: true };

    return {
      success: false,
      message: `${argumentName} can't be empty it's required`,
    };
  }

  static isRequiredBulk(args: ValidateArgumentCollection): ValidateResult {
    for (const arg of args) {
      const result = this.isRequired(arg.argument, arg.argumentName);
      if (!result.success) return result;
    }

    return { success: true };
  }

  static isDate(argument: Date, argumentName: string): Result<ValidateResult> {
    if (
      argument.getMonth &&
      !isNullOrUndefined(argument.getMonth()) &&
      !Number.isNaN(argument.getMonth())
    )
      return Result.ok({ success: true });

    return Result.fail({
      success: false,
      message: `${argumentName} is not a valid Date`,
    });
  }

  static isStringDate(
    argument: string,
    argumentName: string,
  ): Result<ValidateResult> {
    if (Date.parse(argument)) return Result.ok({ success: true });

    return Result.fail({
      success: false,
      message: `${argumentName} is not a valid Date`,
    });
  }

  static isGreaterThan(
    num: number,
    min: number,
    argumentName: string,
  ): Result<ValidateResult> {
    const isGreaterThan = num > min;
    if (!isGreaterThan || Number.isNaN(num)) {
      return Result.fail({
        success: false,
        message: `${argumentName} is not greater than ${min}.`,
      });
    }
    return Result.ok({ success: true });
  }

  static isGreaterOrEqualThan(
    num: number,
    min: number,
    argumentName: string,
  ): Result<ValidateResult> {
    const isGreaterOrEqualThan = num >= min;
    if (!isGreaterOrEqualThan || Number.isNaN(num)) {
      return Result.fail({
        success: false,
        message: `${argumentName} is not greater or equal than ${min}.`,
      });
    }

    return Result.ok();
  }

  static isLessThan(
    num: number,
    max: number,
    argumentName: string,
  ): Result<ValidateResult> {
    const isLessThan = num < max;
    if (!isLessThan || Number.isNaN(num)) {
      return Result.fail({
        success: false,
        message: `${argumentName} is not less than ${max}.`,
      });
    }

    return Result.ok();
  }

  static isLessOrEqualThan(
    num: number,
    max: number,
    argumentName: string,
  ): Result<ValidateResult> {
    const isLessOrEqualThan = num <= max;
    if (!isLessOrEqualThan || Number.isNaN(num)) {
      return Result.fail({
        success: false,
        message: `${argumentName} is not less or equal than ${max}.`,
      });
    }

    return Result.ok();
  }

  static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Result<ValidateResponse> {
    if (isNullOrUndefined(argument)) {
      return Result.fail<ValidateResponse>(
        `${argumentName} is null or undefined`,
      );
    } else {
      return Result.ok<ValidateResponse>();
    }
  }

  static againstNullOrUndefinedBulk(
    args: ValidateArgumentCollection,
  ): Result<ValidateResponse> {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.isFailure) return result;
    }

    return Result.ok<ValidateResponse>();
  }

  static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): Result<ValidateResult> {
    const isInRange = num >= min && num <= max;

    if (!isInRange || Number.isNaN(num)) {
      return Result.fail({
        success: false,
        message: `${argumentName} is not within range ${min} to ${max}.`,
      });
    }

    return Result.ok({ success: true });
  }

  static againstAtLeast(
    numChars: number,
    text: string,
  ): Result<ValidateResult> {
    return text.length >= numChars
      ? Result.ok<ValidateResult>()
      : Result.fail<ValidateResult>({
          success: false,
          message: `Text is not at least ${numChars} chars.`,
        });
  }

  static againstAtMost(numChars: number, text: string): Result<ValidateResult> {
    return text.length <= numChars
      ? Result.ok<ValidateResult>()
      : Result.fail<ValidateResult>({
          success: false,
          message: `Text is greater than ${numChars} chars.`,
        });
  }
}

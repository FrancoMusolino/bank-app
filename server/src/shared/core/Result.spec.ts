import { Result } from './Result';

describe('Result', () => {
  describe('Constructor', () => {
    it('Should throw if an error is given in a success Result', () => {
      expect(() => new Result(true, 'Error')).toThrow();
    });

    it('Should throw if missing error on a failure Result', () => {
      expect(() => new Result(false, undefined)).toThrow();
    });
  });

  describe('Ok Variant', () => {
    it('Should create a success Result', () => {
      const result = Result.ok('Success');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBe('Success');
      expect(result.getErrorValue()).toBeUndefined();
    });
  });

  describe('Failure Variant', () => {
    it('Should create a failure Result', () => {
      const result = Result.fail('Failure');

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('Failure');
    });

    it('Should throw when is failure and trying to get a value', () => {
      const result = Result.fail('Failure');

      expect(() => result.getValue()).toThrow();
      expect(() => result.getValue()).toThrowError(
        new Error(
          "Can't get the value of an error result. Use 'errorValue' instead.",
        ),
      );
    });
  });

  describe('Combine', () => {
    it('Should combine a set of failure Results', () => {
      const result = Result.combine([
        Result.fail('Failure 1'),
        Result.fail('Failure 2'),
      ]);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('Failure 1 - Failure 2');
    });

    it('Should create a success Result if all the given values are OK', () => {
      const result = Result.combine([
        Result.ok('Success 1'),
        Result.ok('Success 2'),
      ]);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBeUndefined();
    });
  });
});

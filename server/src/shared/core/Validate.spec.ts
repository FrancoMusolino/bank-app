import { Validate } from './Validate';

describe('Validate', () => {
  describe('Required and emptiness validations', () => {
    it('should success with a not empty value', () => {
      const result = Validate.isRequired('hola', 'test');
      expect(result.success).toBe(true);
    });

    it('should fail with empty value', () => {
      const result = Validate.isRequired('', 'test');
      expect(result.success).toBe(false);
    });

    it('should success with not empty values', () => {
      const result = Validate.isRequiredBulk([
        { argument: 'hola', argumentName: 'test' },
        { argument: 2, argumentName: 'test' },
        { argument: true, argumentName: 'test' },
      ]);
      expect(result.success).toBe(true);
    });

    it('should fail with at least one empty value', () => {
      const result = Validate.isRequiredBulk([
        { argument: '', argumentName: 'test' },
        { argument: undefined, argumentName: 'test' },
        { argument: null, argumentName: 'test' },
      ]);
      expect(result.success).toBe(false);
    });

    it('should success with a not null/undefined value', () => {
      const result = Validate.againstNullOrUndefined('hola', 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with a null/undefined value', () => {
      const result = Validate.againstNullOrUndefined(undefined, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('should success with not null/undefined values', () => {
      const result = Validate.againstNullOrUndefinedBulk([
        { argument: 'hola', argumentName: 'test' },
        { argument: 2, argumentName: 'test' },
        { argument: true, argumentName: 'test' },
        { argument: '', argumentName: 'test' },
      ]);
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with at least one null/undefined value', () => {
      const result = Validate.againstNullOrUndefinedBulk([
        { argument: undefined, argumentName: 'test' },
        { argument: null, argumentName: 'test' },
      ]);
      expect(result.isSuccess).toBe(false);
    });
  });

  describe('Numbers validations', () => {
    it('should success with a greater value', () => {
      const result = Validate.isGreaterThan(1, 0, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with a not greater value', () => {
      const result = Validate.isGreaterThan(1, 2, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('greater than should fail with a NaN value', () => {
      const result = Validate.isGreaterThan(NaN, 2, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('should success with a greater or equal value', () => {
      const result = Validate.isGreaterOrEqualThan(1, 1, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with a not greater or equal value', () => {
      const result = Validate.isGreaterOrEqualThan(1, 2, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('greater or equal than should fail with a NaN value', () => {
      const result = Validate.isGreaterOrEqualThan(NaN, 2, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('should success with a less value', () => {
      const result = Validate.isLessThan(0, 1, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with a not less value', () => {
      const result = Validate.isLessThan(2, 1, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('less than should fail with a NaN value', () => {
      const result = Validate.isLessThan(NaN, 2, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('should success with a less or equal value', () => {
      const result = Validate.isLessOrEqualThan(1, 1, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with a not less or equal value', () => {
      const result = Validate.isLessOrEqualThan(2, 1, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('less or equal than should fail with a NaN value', () => {
      const result = Validate.isLessOrEqualThan(NaN, 2, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('should success with a "in range" value', () => {
      const result = Validate.inRange(5, 1, 10, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with a not "in range" value', () => {
      const result = Validate.inRange(12, 1, 10, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('in range should fail with a NaN value', () => {
      const result = Validate.inRange(NaN, 1, 10, 'test');
      expect(result.isSuccess).toBe(false);
    });
  });

  describe('Strings validations', () => {
    it('at least should success with a value over a threshold', () => {
      const result = Validate.againstAtLeast(1, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('at least should fail with a value under a threshold', () => {
      const result = Validate.againstAtLeast(10, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('at most should success with a value under a threshold', () => {
      const result = Validate.againstAtMost(10, 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('at most should fail with a value over a threshold', () => {
      const result = Validate.againstAtMost(1, 'test');
      expect(result.isSuccess).toBe(false);
    });
  });

  describe('Dates validations', () => {
    it('should success with a valid date', () => {
      const result = Validate.isDate(new Date(), 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with an invalid date object', () => {
      const result = Validate.isDate({} as Date, 'test');
      expect(result.isSuccess).toBe(false);
    });

    it('should success with a valid string date', () => {
      const result = Validate.isStringDate('2024-01-01', 'test');
      expect(result.isSuccess).toBe(true);
    });

    it('should fail with an invalid string date', () => {
      const result = Validate.isStringDate('2342132', 'test');
      expect(result.isSuccess).toBe(false);
    });
  });

  it('should success with all valid results', () => {
    const result = Validate.combine([
      Validate.isGreaterThan(10, 5, 'test'),
      Validate.isLessOrEqualThan(1, 1, 'test'),
      Validate.againstNullOrUndefined('test', 'test'),
    ]);
    expect(result.isSuccess).toBe(true);
  });

  it('should fail with, at least, one invalid result', () => {
    const result = Validate.combine([
      Validate.isGreaterThan(3, 5, 'test'),
      Validate.isLessOrEqualThan(1, 1, 'test'),
      Validate.againstNullOrUndefined(null, 'test'),
    ]);
    expect(result.isSuccess).toBe(false);
  });
});

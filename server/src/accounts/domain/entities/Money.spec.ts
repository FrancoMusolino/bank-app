import { Currency, Money } from './Money';

describe('Money', () => {
  it('Should create Money from cents', () => {
    const money = Money.fromCents(150, Currency.USD);

    expect(money.getCents()).toBe(150);
    expect(money.getValue()).toBe(1.5);
    expect(money.getCurrency()).toBe(Currency.USD);
  });

  it('Should create Money from string', () => {
    const money = Money.fromString(String('1.50'), Currency.USD);

    expect(money.getCents()).toBe(150);
    expect(money.getValue()).toBe(1.5);
    expect(money.getCurrency()).toBe(Currency.USD);
  });

  it('Should throw with a NaN amount', () => {
    expect(() => Money.fromCents(NaN, Currency.USD)).toThrowError(
      new Error('Cents cannot be NaN'),
    );
  });

  it('Should throw with a NaN string amount', () => {
    expect(() => Money.fromString('asd', Currency.USD)).toThrowError(
      new Error('Invalid string amount'),
    );
  });
});

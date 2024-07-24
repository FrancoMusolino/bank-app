export enum Currency {
  USD = 'USD',
}

export class Money {
  private cents = 0;
  private currency: Currency;

  private constructor(amount: number, currency: Currency) {
    this.cents = amount;
    this.currency = currency;
  }

  static fromString(amount: string, currency: Currency) {
    const float = parseFloat(amount);
    if (Number.isNaN(float)) throw new Error('Invalid string amount');

    return new Money(Math.round(float * 100), currency);
  }

  static fromCents(cents: number, currency: Currency) {
    if (Number.isNaN(cents)) throw new Error('Cents cannot be NaN');

    return new Money(cents, currency);
  }

  getCurrency() {
    return this.currency;
  }

  getCents() {
    return this.cents;
  }

  getValue() {
    //return rounded value to 2 decimal places
    return Number((this.cents / 100).toFixed(2));
  }
}

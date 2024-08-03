export class Cents {
  static fromString(amount: string) {
    return Number(amount) * 100;
  }
}

import {
  Transaction,
  TransactionPropsDTO,
  TransactionType,
} from './Transaction';

const data: TransactionPropsDTO = {
  id: 'abc',
  type: TransactionType.DEPOSIT,
  amount: 10000,
  accountId: 'abc',
};

describe('Transaction', () => {
  it('Should create a Transaction', () => {
    const transactionResult = Transaction.create(data);
    expect(transactionResult.isSuccess).toBe(true);

    const transaction = transactionResult.getValue();
    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.toDTO()).toMatchObject(data);
    expect(transaction.getId()).toBe(data.id);
    expect(transaction.getType()).toBe(data.type);
    expect(transaction.getAmount()).toBe(data.amount);
  });

  it('Should assign an ID if no one is provided', () => {
    const transaction = Transaction.create({
      ...data,
      id: undefined,
    }).getValue();
    expect(transaction.getId()).toBeDefined();
  });

  it('Should fail with a null type', () => {
    const transactionResult = Transaction.create({ ...data, type: null });
    expect(transactionResult.isSuccess).toBe(false);
  });

  it('Should fail with a null amount', () => {
    const transactionResult = Transaction.create({ ...data, amount: null });
    expect(transactionResult.isSuccess).toBe(false);
  });

  it('Should fail with a null accountId', () => {
    const transactionResult = Transaction.create({ ...data, accountId: null });
    expect(transactionResult.isSuccess).toBe(false);
  });

  it('Should fail with a 0 amount', () => {
    const transactionResult = Transaction.create({ ...data, amount: 0 });
    expect(transactionResult.isSuccess).toBe(false);
  });

  it('Should fail with a negative amount', () => {
    const transactionResult = Transaction.create({ ...data, amount: -10000 });
    expect(transactionResult.isSuccess).toBe(false);
  });
});

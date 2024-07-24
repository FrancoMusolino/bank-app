import {
  Transaction,
  TransactionPropsDTO,
  TransactionType,
} from '@/transactions/domain/entities/Transaction';
import { Account, AccountPropsDTO } from './Account';
import { AccountCreatedEvent } from '../events/account-created.event';
import { Result } from '@/shared/core/Result';
import { DepositMadeEvent } from '../events/deposit-made.event';
import { WithdrawalMadeEvent } from '../events/withdrawal-made.event';

const transactions: TransactionPropsDTO[] = [
  {
    id: 'qwe',
    accountId: 'abc',
    amount: 100,
    type: TransactionType.WITHDRAWAL,
  },
  {
    id: 'rty',
    accountId: 'abc',
    amount: 1000,
    type: TransactionType.DEPOSIT,
  },
];

const data: AccountPropsDTO = {
  id: 'abc',
  name: 'Test account',
  number: 123456,
  balance: 10_000,
  ownerId: 'xyz',
  transactions,
};

describe('Account', () => {
  const applySpy = jest.spyOn(Account.prototype, 'apply');
  afterEach(() => {
    applySpy.mockReset();
  });

  describe('Create', () => {
    it('Should create an Account', () => {
      const accountResult = Account.create(data);
      expect(accountResult.isSuccess).toBe(true);

      const account = accountResult.getValue();
      expect(account.toDTO()).toMatchObject(data);
      expect(account.getId()).toBe(data.id);
    });

    it('Should fail with an empty name', () => {
      const accountResult = Account.create({ ...data, name: null });
      expect(accountResult.isSuccess).toBe(false);
    });

    it('Should fail with an empty number', () => {
      const accountResult = Account.create({ ...data, number: null });
      expect(accountResult.isSuccess).toBe(false);
    });

    it('Should fail with an empty ownerId', () => {
      const accountResult = Account.create({ ...data, ownerId: null });
      expect(accountResult.isSuccess).toBe(false);
    });

    it('Should fail with an empty balance', () => {
      const accountResult = Account.create({ ...data, balance: null });
      expect(accountResult.isSuccess).toBe(false);
    });

    it('Should fail with an invalid balance', () => {
      const accountResult = Account.create({ ...data, balance: -100 });
      expect(accountResult.isSuccess).toBe(false);
    });

    it('Should fail with an invalid transaction', () => {
      const accountResult = Account.create({
        ...data,
        transactions: [
          {
            id: 'xyz',
            amount: -100,
            accountId: 'abc',
            type: TransactionType.DEPOSIT,
          },
        ],
      });
      expect(accountResult.isSuccess).toBe(false);
    });

    it('Should assign an empty array if not transactions were provided', () => {
      const accountResult = Account.create({
        ...data,
        transactions: undefined,
      });
      expect(accountResult.isSuccess).toBe(true);

      const account = accountResult.getValue();
      expect(account.getTransactions()).toHaveLength(0);
    });

    it('Should apply account created event if ID was not provided', () => {
      const account = Account.create({ ...data, id: null }).getValue();

      expect(account.getId()).toBeDefined();
      expect(applySpy).toHaveBeenCalledWith(
        new AccountCreatedEvent(account.toDTO()),
      );
    });
  });

  describe('Account from events', () => {
    it('Should create an account from events', () => {
      const events = [
        new AccountCreatedEvent({ ...data, transactions: [] } as any),
        new WithdrawalMadeEvent({
          accountId: data.id,
          amount: 1000,
          transactionId: 'abc',
        }),
        new DepositMadeEvent({
          accountId: data.id,
          amount: 100,
          transactionId: 'abc',
        }),
      ];

      const accountResult = Account.applyEvents(events);
      expect(accountResult.isSuccess).toBe(true);

      const account = accountResult.getValue();
      expect(account.getId()).toBe(data.id);
      expect(account.getBalance()).toBe(data.balance - 1000 + 100);
      expect(account.getTransactions()).toHaveLength(2);
    });

    it('Should fail if the first event is not account created', () => {
      const events = [
        new WithdrawalMadeEvent({
          accountId: data.id,
          amount: 1000,
          transactionId: 'abc',
        }),
        new AccountCreatedEvent({ ...data, transactions: [] } as any),
      ];

      const accountResult = Account.applyEvents(events);
      expect(accountResult.isSuccess).toBe(false);
      expect(accountResult.getErrorValue()).toBe(
        'Error al realizar la proyección de la cuenta',
      );
    });
  });

  describe('Transactions', () => {
    let account: Account;
    beforeEach(() => {
      account = Account.create(data).getValue();
    });

    it('Should successfully do a deposit', () => {
      const depositSpy = jest.spyOn(Account.prototype as any, 'deposit');

      const prevTransactions = account.getTransactions();
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 100,
        type: TransactionType.DEPOSIT,
      }).getValue();

      const depositResult = account.addTransaction(transaction);
      expect(depositResult.isSuccess).toBe(true);
      expect(account.getTransactions()).toHaveLength(
        prevTransactions.length + 1,
      );
      expect(depositSpy).toHaveBeenCalledWith(transaction);
      expect(depositSpy).toHaveReturnedWith(Result.ok('Depósito exitoso'));
    });

    it('Should add deposit amount to account balance', () => {
      const prevBalance = account.getBalance();
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 100,
        type: TransactionType.DEPOSIT,
      }).getValue();

      account.addTransaction(transaction);
      expect(account.getBalance()).toBe(prevBalance + transaction.getAmount());
    });

    it('Should apply deposit made event on success deposit', () => {
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 100,
        type: TransactionType.DEPOSIT,
      }).getValue();

      account.addTransaction(transaction);
      expect(applySpy).toHaveBeenCalledWith(
        new DepositMadeEvent({
          accountId: account.getId(),
          amount: transaction.getAmount(),
          transactionId: transaction.getId(),
        }),
      );
    });

    it('Should successfully do a withdrawal', () => {
      const withdrawSpy = jest.spyOn(Account.prototype as any, 'withdraw');

      const prevTransactions = account.getTransactions();
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 100,
        type: TransactionType.WITHDRAWAL,
      }).getValue();

      const withdrawResult = account.addTransaction(transaction);
      expect(withdrawResult.isSuccess).toBe(true);
      expect(account.getTransactions()).toHaveLength(
        prevTransactions.length + 1,
      );
      expect(withdrawSpy).toHaveBeenCalledWith(transaction);
      expect(withdrawSpy).toHaveReturnedWith(Result.ok('Retiro exitoso'));
    });

    it('Should substract withdrawal amount to account balance', () => {
      const prevBalance = account.getBalance();
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 100,
        type: TransactionType.WITHDRAWAL,
      }).getValue();

      account.addTransaction(transaction);
      expect(account.getBalance()).toBe(prevBalance - transaction.getAmount());
    });

    it('Should fail if withdrawal amount is greater than account balance', () => {
      const prevTransactions = account.getTransactions();
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 1_000_000,
        type: TransactionType.WITHDRAWAL,
      }).getValue();

      const transactionResult = account.addTransaction(transaction);

      expect(transactionResult.isSuccess).toBe(false);
      expect(transactionResult.getErrorValue()).toBe('Saldo insuficiente');
      expect(account.getTransactions()).toHaveLength(prevTransactions.length);
    });

    it('Should apply withdrawal made event on success withdraw', () => {
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 100,
        type: TransactionType.WITHDRAWAL,
      }).getValue();

      account.addTransaction(transaction);
      expect(applySpy).toHaveBeenCalledWith(
        new WithdrawalMadeEvent({
          accountId: account.getId(),
          amount: transaction.getAmount(),
          transactionId: transaction.getId(),
        }),
      );
    });

    it('Should fail with an unknown operation', () => {
      const transaction = Transaction.create({
        id: '123',
        accountId: data.id,
        amount: 1_000_000,
        type: 'UNKNOWN_OPERATION' as TransactionType,
      }).getValue();

      const transactionResult = account.addTransaction(transaction);

      expect(transactionResult.isSuccess).toBe(false);
      expect(transactionResult.getErrorValue()).toBe('Unknown operation');
    });
  });
});

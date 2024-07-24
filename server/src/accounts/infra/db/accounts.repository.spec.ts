import { Account, AccountPropsDTO } from '@/accounts/domain/entities/Account';
import { AccountsRepository } from './accounts.repository';

const accountData: Partial<AccountPropsDTO> = {
  id: 'xyz',
  name: 'Test account',
  number: 123456,
  balance: 0,
  ownerId: 'asd',
  transactions: [],
};

describe('Accounts repository', () => {
  let repository: AccountsRepository;

  const createAggregateStreamSpy = jest.spyOn(
    AccountsRepository.prototype as any,
    'createAggregateStreamIfNotExists',
  );

  beforeEach(() => {
    repository = new AccountsRepository();
  });

  afterEach(() => {
    createAggregateStreamSpy.mockClear();
  });

  describe('Save', () => {
    it('Should successfully save account events by aggregate', () => {
      const account = Account.create({ ...accountData, id: null }).getValue();
      repository.save(account);

      expect(createAggregateStreamSpy).toHaveBeenCalledWith(account.getId());
      expect(repository.getAggregateEvents(account.getId())).toHaveLength(1);
    });

    it('Should return empty array if the aggregate does not exist ', () => {
      expect(repository.getAggregateEvents('any')).toHaveLength(0);
    });
  });

  describe('Find', () => {
    it('Should successfully return an account', () => {
      const account = Account.create({ ...accountData, id: null }).getValue();
      repository.save(account);

      const findAccountResult = repository.findOneById(account.getId());
      expect(findAccountResult.isSuccess).toBe(true);

      const accountFound = findAccountResult.getValue();
      expect(accountFound).toBeInstanceOf(Account);
      expect(accountFound.toDTO()).toMatchObject(account.toDTO());
    });

    it('Should fail on trying to find an inexistent account by ID', () => {
      const findByIdResult = repository.findOneById('qwerty');

      expect(findByIdResult.isSuccess).toBe(false);
      expect(findByIdResult.getErrorValue()).toBe(
        'No se ha encontrado la cuenta',
      );
    });
  });
});

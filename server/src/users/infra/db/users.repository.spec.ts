import { User, UserPropsDTO } from '@/users/domain/entities/User';
import { UsersRepository } from './users.repository';

const userData: Partial<UserPropsDTO> = {
  id: 'asd',
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd123',
  accountId: null,
};

describe('Users repository', () => {
  let repository: UsersRepository;

  const registerUserSpy = jest.spyOn(
    UsersRepository.prototype as any,
    'registerUser',
  );

  const connectAccountSpy = jest.spyOn(
    UsersRepository.prototype as any,
    'connectAccount',
  );

  beforeEach(() => {
    repository = new UsersRepository();
  });

  afterEach(() => {
    registerUserSpy.mockClear();
    connectAccountSpy.mockClear();
  });

  describe('Save', () => {
    it('Should successfully register a user', () => {
      const user = User.create({ ...userData, id: null }).getValue();
      repository.save(user);

      expect(registerUserSpy).toHaveBeenCalledWith(user.toDTO());
      expect(repository.exists(userData.email)).toBe(true);
    });

    it('Should successfully connect user with account', () => {
      const user = User.create({ ...userData, id: null }).getValue();

      const accountId = 'asd';
      user.connectAccount(accountId);
      repository.save(user);

      expect(connectAccountSpy).toHaveBeenCalledWith({
        accountId,
        userId: user.getId(),
      });

      const userFound = repository.findOneById(user.getId()).getValue();
      expect(userFound.getAccount()).toBe(accountId);
    });

    it('Should only connect user with account if IDs matches', () => {
      const user = User.create({ ...userData, id: null }).getValue();
      const user2 = User.create({ ...userData, id: null }).getValue();
      repository.save(user2);

      const accountId = 'asd';
      user.connectAccount(accountId);
      repository.save(user);

      const userFound = repository.findOneById(user.getId()).getValue();
      expect(userFound.getAccount()).toBe(accountId);

      const user2Found = repository.findOneById(user2.getId()).getValue();
      expect(user2Found.getAccount()).toBeUndefined();
    });
  });

  describe('Find', () => {
    it('Should successfully find a user by ID if exists', () => {
      const user = User.create({ ...userData, id: null }).getValue();
      repository.save(user);

      const findUserResult = repository.findOneById(user.getId());

      expect(findUserResult.isSuccess).toBe(true);

      const userFound = findUserResult.getValue();
      expect(userFound).toBeInstanceOf(User);
      expect(userFound.toDTO()).toMatchObject(user.toDTO());
    });

    it('Should fail on trying to find an inexistent user by ID', () => {
      const findByIdResult = repository.findOneById('qwerty');

      expect(findByIdResult.isSuccess).toBe(false);
      expect(findByIdResult.getErrorValue()).toBe(
        'No se ha encontrado al usuario',
      );
    });

    it('Should successfully find a user by email if exists', () => {
      const user = User.create({ ...userData, id: null }).getValue();
      repository.save(user);

      const findUserResult = repository.findOneByEmail(userData.email);

      expect(findUserResult.isSuccess).toBe(true);

      const userFound = findUserResult.getValue();
      expect(userFound).toBeInstanceOf(User);
      expect(userFound.toDTO()).toMatchObject(user.toDTO());
    });

    it('Should fail on trying to find an inexistent user by email', () => {
      const findByEmailResult = repository.findOneByEmail('invalid@gmail.com');

      expect(findByEmailResult.isSuccess).toBe(false);
      expect(findByEmailResult.getErrorValue()).toBe(
        'No se ha encontrado al usuario',
      );
    });
  });

  describe('Exists', () => {
    it('Should return false if the user does not exist', () => {
      expect(repository.exists('invalid@gmail.com')).toBe(false);
    });
  });
});

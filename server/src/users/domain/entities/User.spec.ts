import { AccountConnectedEvent } from '../events/account-connected.event';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { Password } from './Password';
import { User, UserPropsDTO } from './User';

const data: UserPropsDTO = {
  id: 'abc',
  firstname: 'Juan',
  lastname: 'Pedro',
  email: 'juan@gmail.com',
  password: Password.hash('asd'),
  accountId: '123',
};

describe('User', () => {
  it('Should create a User', () => {
    const userResult = User.create(data);
    expect(userResult.isSuccess).toBe(true);

    const user = userResult.getValue();
    expect(user.toDTO()).toMatchObject(data);
  });

  it('Should fail with a null firstname', () => {
    const userResult = User.create({ ...data, firstname: null });
    expect(userResult.isSuccess).toBe(false);
  });

  it('Should fail with a null lastname', () => {
    const userResult = User.create({ ...data, lastname: null });
    expect(userResult.isSuccess).toBe(false);
  });

  it('Should fail with a null email', () => {
    const userResult = User.create({ ...data, email: null });
    expect(userResult.isSuccess).toBe(false);
  });

  it('Should fail with an invalid email', () => {
    const userResult = User.create({ ...data, email: 'asd' });
    expect(userResult.isSuccess).toBe(false);
  });

  it('Should fail with a null password', () => {
    const userResult = User.create({ ...data, password: null });
    expect(userResult.isSuccess).toBe(false);
  });

  it('Should fail with an invalid password', () => {
    const userResult = User.create({ ...data, password: '' });
    expect(userResult.isSuccess).toBe(false);
  });

  describe("User's account", () => {
    it('Should connect an account to a user', () => {
      const user = User.create({ ...data, accountId: null }).getValue();
      expect(user.hasAccount()).toBe(false);

      user.connectAccount(data.accountId);
      expect(user.hasAccount()).toBe(true);
      expect(user.getAccount()).toBe(data.accountId);
    });

    it('Should fail on connecting an account if user already has one', () => {
      const user = User.create(data).getValue();
      const connectAccountResult = user.connectAccount(data.accountId);

      expect(connectAccountResult.isSuccess).toBe(false);
      expect(connectAccountResult.getErrorValue()).toBe(
        'Ya tienes una cuenta asociada',
      );
    });

    it('Should return undefined if an user hasnt have an account', () => {
      const user = User.create({ ...data, accountId: null }).getValue();
      expect(user.getAccount()).toBeUndefined();
    });
  });

  describe("User's credentials", () => {
    it('Should be valid with the right credentials', async () => {
      const user = User.create(data).getValue();
      expect(await user.validateCredentials('asd')).toBe(true);
    });

    it('Should not be valid with different credentials', async () => {
      const user = User.create(data).getValue();
      expect(await user.validateCredentials('123')).toBe(false);
    });
  });

  describe('Events', () => {
    it('Should apply user created event if ID was not provided', () => {
      const applySpy = jest.spyOn(User.prototype, 'apply');
      const user = User.create({ ...data, id: null }).getValue();

      expect(user.getId()).toBeDefined();
      expect(applySpy).toHaveBeenCalledWith(
        new UserRegisteredEvent(user.toDTO()),
      );

      applySpy.mockRestore();
    });

    it('Should apply account connected event on connecting an account', () => {
      const user = User.create({ ...data, accountId: null }).getValue();
      const applySpy = jest.spyOn(user, 'apply');

      user.connectAccount(data.accountId);
      expect(applySpy).toHaveBeenCalledWith(
        new AccountConnectedEvent({
          userId: user.getId(),
          accountId: user.getAccount(),
        }),
      );

      applySpy.mockRestore();
    });
  });
});

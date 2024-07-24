import { UsersRepository } from '@/users/infra/db/users.repository';
import { User } from '../../../../domain/entities/User';
import { AccountCreatedHandler } from './account-created.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { AccountCreatedEvent } from '@/accounts/domain/events/account-created.event';
import { Result } from '@/shared/core/Result';

const fakeUser = {
  id: 'asd',
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd123',
  accountId: null,
};

const account = {
  id: 'xyz',
  balance: 0,
  name: 'Test account',
  number: 12345,
  ownerId: 'asd',
};

describe('[Users]: Account Created Handler', () => {
  let handler: AccountCreatedHandler;

  const commitFn = jest.spyOn(User.prototype, 'commit').mockReturnThis();

  const usersRepositoryMock = {
    findOneById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AccountCreatedHandler,
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    handler = module.get<AccountCreatedHandler>(AccountCreatedHandler);
  });

  afterEach(() => {
    usersRepositoryMock.findOneById.mockReset();
    usersRepositoryMock.save.mockReset();
    commitFn.mockClear();
  });

  it('Should successfully connect a user with his/her account', () => {
    const userResult = User.create(fakeUser);
    usersRepositoryMock.findOneById.mockReturnValue(userResult);
    const user = userResult.getValue();

    handler.handle(new AccountCreatedEvent(account));

    expect(usersRepositoryMock.save).toHaveBeenCalledWith(user);
    expect(commitFn).toHaveBeenCalled();
    expect(user.hasAccount()).toBe(true);
    expect(user.getAccount()).toBe(account.id);
  });

  it('Should not connect an account if cannot find a user', () => {
    usersRepositoryMock.findOneById.mockReturnValue(Result.fail('Error'));

    handler.handle(new AccountCreatedEvent(account));

    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(commitFn).not.toHaveBeenCalled();
  });

  it('Should not connect an account if the user already has one', () => {
    usersRepositoryMock.findOneById.mockReturnValue(
      User.create({ ...fakeUser, accountId: 'xyz' }),
    );

    handler.handle(new AccountCreatedEvent(account));

    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(commitFn).not.toHaveBeenCalled();
  });
});

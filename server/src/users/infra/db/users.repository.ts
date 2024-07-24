import { Injectable } from '@nestjs/common';

import { User, UserPropsDTO } from '@/users/domain/entities/User';
import { Result } from '@/shared/core/Result';
import { UserRegisteredEvent } from '@/users/domain/events/user-registered.event';
import { AccountConnectedEvent } from '@/users/domain/events/account-connected.event';
import { IUsersRepository } from '@/users/domain/repository/IUsersRepository';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private users: UserPropsDTO[] = [];

  exists(email: string): boolean {
    return this.users.some((user) => user.email === email);
  }

  findOneById(id: string): Result<User> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return Result.fail('No se ha encontrado al usuario');
    }

    return User.create(user);
  }

  findOneByEmail(email: string): Result<User> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return Result.fail('No se ha encontrado al usuario');
    }

    return User.create(user);
  }

  save(user: User): void {
    const events = user.getUncommittedEvents();

    events.forEach((event) => {
      if (event instanceof UserRegisteredEvent) {
        this.registerUser(event.data);
      }
      if (event instanceof AccountConnectedEvent) {
        this.connectAccount(event.data);
      }
    });
  }

  private registerUser(user: UserRegisteredEvent['data']) {
    this.users.push(user);
  }

  private connectAccount(data: AccountConnectedEvent['data']) {
    this.users = this.users.map((user) =>
      user.id !== data.userId ? user : { ...user, accountId: data.accountId },
    );
  }
}

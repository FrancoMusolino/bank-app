import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { JwtPayload, JwtStrategy } from './jwt.strategy';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { User, UserPropsDTO } from '@/users/domain/entities/User';
import { Result } from '@/shared/core/Result';
import { UnauthorizedException } from '@nestjs/common';

const userData: UserPropsDTO = {
  id: 'asd',
  email: 'test@gmail.com',
  firstname: 'Test',
  lastname: 'Test',
  password: 'asd123',
  accountId: null,
};

const payload: JwtPayload = {
  id: 'asd',
  firstname: 'Test',
  lastname: 'Test',
};

describe('JWT Strategy', () => {
  let strategy: JwtStrategy;

  const usersRepositoryMock = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
      providers: [
        JwtStrategy,
        { provide: UsersRepository, useValue: usersRepositoryMock },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    usersRepositoryMock.findOneById.mockReset();
  });

  it('Should return the payload if the user exists', async () => {
    usersRepositoryMock.findOneById.mockReturnValueOnce(User.create(userData));

    const result = await strategy.validate(payload);

    expect(usersRepositoryMock.findOneById).toBeCalledWith(payload.id);
    expect(result).toMatchObject(payload);
  });

  it('Should throw if the users does not exist', async () => {
    usersRepositoryMock.findOneById.mockReturnValueOnce(Result.fail('Error'));

    await expect(strategy.validate(payload)).rejects.toThrowError(
      new UnauthorizedException('Las credenciales son inválidas'),
    );
  });
});

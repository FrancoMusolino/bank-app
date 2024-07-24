import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';

import { RegisterDto } from '@/auth/infra/http/dtos/register.dto';
import { Result } from '@/shared/core/Result';
import { UserPropsDTO } from '@/users/domain/entities/User';
import { RegisterUserCommand } from '@/users/application/use-cases/commands/register-user/register-user.command';
import { JwtPayload } from '@/auth/infra/jwt/jwt.strategy';
import { UsersRepository } from '@/users/infra/db/users.repository';
import { LoginDto } from '@/auth/infra/http/dtos/login.dto';

type AuthResponse = JwtPayload & { token: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwt: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(data: RegisterDto): Promise<Result<AuthResponse>> {
    const registerUserResult = await this.commandBus.execute<
      RegisterUserCommand,
      Result<UserPropsDTO>
    >(new RegisterUserCommand(data));

    if (registerUserResult.isFailure) {
      return Result.fail(registerUserResult.getErrorValue());
    }
    const user = registerUserResult.getValue();

    const payload: JwtPayload = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    const token = this.jwt.sign(payload);

    return Result.ok({ ...payload, token });
  }

  async login(data: LoginDto): Promise<Result<AuthResponse>> {
    const userOrError = this.usersRepository.findOneByEmail(data.email);
    if (userOrError.isFailure) {
      return Result.fail('Credenciales inválidas');
    }
    const user = userOrError.getValue();

    const isValid = await user.validateCredentials(data.password);
    if (!isValid) {
      return Result.fail('Credenciales inválidas');
    }

    const userDTO = user.toDTO();

    const payload: JwtPayload = {
      id: userDTO.id,
      firstname: userDTO.firstname,
      lastname: userDTO.lastname,
    };

    const token = this.jwt.sign(payload);

    return Result.ok({ ...payload, token });
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from '@/users/infra/db/users.repository';

export type JwtPayload = {
  id: string;
  firstname: string;
  lastname: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('SECRET_JWT'),
    });
  }

  async validate(payload: JwtPayload) {
    const userOrError = this.usersRepository.findOneById(payload.id);
    if (userOrError.isFailure) {
      throw new UnauthorizedException('Las credenciales son inválidas');
    }

    return payload;
  }
}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '@/auth/application/services/auth.service';
import { AuthController } from '../http/controller/auth.controller';
import { UsersModule } from '@/users/infra/modules/users.module';
import { JwtStrategy } from '../jwt/jwt.strategy';

@Module({
  imports: [
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_JWT'),
        verifyOptions: {
          ignoreExpiration: true,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

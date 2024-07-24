import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './auth/infra/jwt/jwt-auth.guard';

// Modules
import { AuthModule } from './auth/infra/modules/auth.module';
import { UsersModule } from './users/infra/modules/users.module';
import { AccountsModule } from './accounts/infra/modules/accounts.module';
import { TransactionsModule } from './transactions/infra/modules/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

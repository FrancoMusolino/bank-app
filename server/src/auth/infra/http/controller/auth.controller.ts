import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from '@/auth/application/services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { Public } from '../../jwt/public.decorator';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() data: RegisterDto) {
    const result = await this.authService.register(data);

    if (result.isFailure) {
      throw new BadRequestException(result.getErrorValue());
    }

    return result.getValue();
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto) {
    const result = await this.authService.login(data);

    if (result.isFailure) {
      throw new BadRequestException(result.getErrorValue());
    }

    return result.getValue();
  }
}

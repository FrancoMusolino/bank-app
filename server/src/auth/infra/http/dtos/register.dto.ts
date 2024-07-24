import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre es inválido' })
  @MaxLength(255, {
    message: 'El nombre no debe exceder los 255 caracteres',
  })
  firstname: string;

  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'El apellido es inválido' })
  @MaxLength(255, {
    message: 'El apellido no debe exceder los 255 caracteres',
  })
  lastname: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email es inválido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña es inválida' })
  password: string;
}

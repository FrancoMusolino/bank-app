import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'El nombre de cuenta es requerido' })
  @IsString({ message: 'El nombre de cuenta es inválido' })
  @MaxLength(255, {
    message: 'El nombre de cuenta no debe exceder los 255 caracteres',
  })
  name: string;

  @IsNotEmpty({ message: 'El número de cuenta es requerido' })
  @IsInt({ message: 'El número de cuenta es inválido' })
  number: number;

  @IsOptional()
  @IsInt({ message: 'El balance de la cuenta es inválido' })
  @IsPositive({ message: 'El balance de la cuenta es inválido' })
  balance?: number;
}

import { TransactionType } from '@/transactions/domain/entities/Transaction';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddTransactionDto {
  @IsNotEmpty({ message: 'Debe enviar el monto de la transacción' })
  @IsInt({ message: 'El monto de la transacción es inválido' })
  @IsPositive({ message: 'El monto de la transacción es inválido' })
  amount: number;

  @IsNotEmpty({ message: 'Debe enviar el tipo de transacción' })
  @IsEnum(TransactionType, { message: 'El tipo de transacción es inválida' })
  type: TransactionType;
}

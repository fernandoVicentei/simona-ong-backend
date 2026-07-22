import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateProjectIndicatorProgressDto {
  @IsDateString({}, { message: 'La fecha de progreso debe ser una fecha válida (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'La fecha de progreso es requerida' })
  progressDate: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El valor actual debe ser un número con hasta 2 decimales' },
  )
  @IsNotEmpty({ message: 'El valor actual es requerido' })
  currentValue: number;

  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  @IsOptional()
  observations?: string;
}

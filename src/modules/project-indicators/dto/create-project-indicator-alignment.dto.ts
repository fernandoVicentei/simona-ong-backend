import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateProjectIndicatorAlignmentDto {
  @IsInt({ message: 'El ID del indicador estratégico debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del indicador estratégico es requerido' })
  strategicIndicatorId: number;
}

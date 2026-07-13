import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class UpdateStrategicPlanDto {
  @IsInt({ message: 'El ID de la organización debe ser un número entero' })
  @IsOptional()
  organizationId?: number;

  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(30, { message: 'El código no puede exceder los 30 caracteres' })
  code?: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(200, { message: 'El nombre no puede exceder los 200 caracteres' })
  name?: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @IsInt({ message: 'El año de inicio debe ser un número entero' })
  @IsOptional()
  @Min(2000, { message: 'El año de inicio debe ser mayor o igual a 2000' })
  @Max(2100, { message: 'El año de inicio debe ser menor o igual a 2100' })
  startYear?: number;

  @IsInt({ message: 'El año de fin debe ser un número entero' })
  @IsOptional()
  @Min(2000, { message: 'El año de fin debe ser mayor o igual a 2000' })
  @Max(2100, { message: 'El año de fin debe ser menor o igual a 2100' })
  endYear?: number;

  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  active?: boolean;
}

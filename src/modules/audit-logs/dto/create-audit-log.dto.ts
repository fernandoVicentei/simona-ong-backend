import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAuditLogDto {
  @IsNumber({}, { message: 'El ID de usuario debe ser un número' })
  userId: number;

  @IsString()
  @IsNotEmpty({ message: 'El módulo es requerido' })
  @MaxLength(100, { message: 'El módulo no puede exceder 100 caracteres' })
  module: string;

  @IsString()
  @IsNotEmpty({ message: 'La acción es requerida' })
  @MaxLength(50, { message: 'La acción no puede exceder 50 caracteres' })
  action: string;

  @IsNumber({}, { message: 'El ID de registro debe ser un número' })
  @IsOptional()
  recordId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'La IP no puede exceder 50 caracteres' })
  ip?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

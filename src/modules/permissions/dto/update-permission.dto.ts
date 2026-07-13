import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El código debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El código no puede exceder 100 caracteres' })
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;
}

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la organización es requerido' })
  @MinLength(3, {
    message: 'El nombre debe tener al menos 3 caracteres',
  })
  @MaxLength(200, {
    message: 'El nombre no puede exceder 200 caracteres',
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'La descripción no puede exceder 500 caracteres',
  })
  description?: string;
}

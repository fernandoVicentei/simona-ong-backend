import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'El teléfono no puede exceder 30 caracteres' })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El cargo no puede exceder 100 caracteres' })
  position?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada ID de rol debe ser un número' })
  @IsOptional()
  roleIds?: number[];
}

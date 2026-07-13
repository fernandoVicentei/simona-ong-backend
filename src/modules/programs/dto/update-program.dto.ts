import {
    IsOptional,
    IsString,
    IsInt,
    IsBoolean,
    MaxLength,
} from 'class-validator';

export class UpdateProgramDto {
    @IsInt({ message: 'El ID del plan estratégico debe ser un número entero' })
    @IsOptional()
    strategicPlanId?: number;

    @IsString({ message: 'El código debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(30, { message: 'El código no puede exceder los 30 caracteres' })
    code?: string;

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(200, { message: 'El nombre no puede exceder los 200 caracteres' })
    name?: string;

    @IsString({ message: 'El objetivo general debe ser una cadena de texto' })
    @IsOptional()
    generalObjective?: string;

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    description?: string;

    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    active?: boolean;
}

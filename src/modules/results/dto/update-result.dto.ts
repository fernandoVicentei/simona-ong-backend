import {
    IsOptional,
    IsString,
    IsInt,
    IsBoolean,
    IsNumber,
    MaxLength,
    Min,
    Max,
} from 'class-validator';

export class UpdateResultDto {
    @IsInt({ message: 'El ID del objetivo debe ser un número entero' })
    @IsOptional()
    objectiveId?: number;

    @IsString({ message: 'El código debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(30, { message: 'El código no puede exceder los 30 caracteres' })
    code?: string;

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(250, { message: 'El nombre no puede exceder los 250 caracteres' })
    name?: string;

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    description?: string;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El porcentaje de cumplimiento debe ser un número con hasta 2 decimales' },
    )
    @IsOptional()
    @Min(0, { message: 'El porcentaje de cumplimiento no puede ser menor a 0' })
    @Max(100, { message: 'El porcentaje de cumplimiento no puede ser mayor a 100' })
    completionPercentage?: number;

    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    active?: boolean;
}

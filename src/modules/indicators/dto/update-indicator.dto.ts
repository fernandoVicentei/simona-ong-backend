import {
    IsOptional,
    IsString,
    IsInt,
    IsBoolean,
    IsNumber,
    IsEnum,
    MaxLength,
} from 'class-validator';
import { IndicatorType } from '../entities/indicator.entity';

export class UpdateIndicatorDto {
    @IsEnum(IndicatorType, {
        message: 'El tipo debe ser OBJECTIVE, RESULT o ACTIVITY',
    })
    @IsOptional()
    type?: IndicatorType;

    @IsInt({ message: 'El ID del objetivo debe ser un número entero' })
    @IsOptional()
    objectiveId?: number;

    @IsInt({ message: 'El ID del resultado debe ser un número entero' })
    @IsOptional()
    resultId?: number;

    @IsInt({ message: 'El ID de la actividad debe ser un número entero' })
    @IsOptional()
    activityId?: number;

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
        { message: 'El valor meta debe ser un número con hasta 2 decimales' },
    )
    @IsOptional()
    targetValue?: number;

    @IsString({ message: 'La unidad de medida debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(100, {
        message: 'La unidad de medida no puede exceder los 100 caracteres',
    })
    measurementUnit?: string;

    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    active?: boolean;
}

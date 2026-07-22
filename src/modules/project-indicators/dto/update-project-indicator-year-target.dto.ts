import {
    IsOptional,
    IsInt,
    IsNumber,
    Min,
} from 'class-validator';

export class UpdateProjectIndicatorYearTargetDto {
    @IsInt({ message: 'El año debe ser un número entero' })
    @IsOptional()
    year?: number;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El valor meta debe ser un número con hasta 2 decimales' },
    )
    @IsOptional()
    @Min(0, { message: 'El valor meta no puede ser menor a 0' })
    targetValue?: number;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El valor alcanzado debe ser un número con hasta 2 decimales' },
    )
    @IsOptional()
    @Min(0, { message: 'El valor alcanzado no puede ser menor a 0' })
    achievedValue?: number;
}

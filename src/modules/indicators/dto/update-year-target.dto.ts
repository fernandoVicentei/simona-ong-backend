import {
    IsOptional,
    IsNumber,
    IsInt,
} from 'class-validator';

export class UpdateYearTargetDto {
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El valor meta debe ser un número con hasta 2 decimales' },
    )
    @IsOptional()
    targetValue?: number;

    @IsInt({ message: 'El valor alcanzado debe ser un número entero' })
    @IsOptional()
    achievedValue?: number;
}

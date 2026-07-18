import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    Min,
} from 'class-validator';

export class CreateYearTargetDto {
    @IsInt({ message: 'El año debe ser un número entero' })
    @IsNotEmpty({ message: 'El año es requerido' })
    @Min(1900, { message: 'El año debe ser mayor o igual a 1900' })
    year: number;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El valor meta debe ser un número con hasta 2 decimales' },
    )
    @IsNotEmpty({ message: 'El valor meta es requerido' })
    targetValue: number;
}

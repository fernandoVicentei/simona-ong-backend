import {
    IsNotEmpty,
    IsInt,
    IsNumber,
    Min,
} from 'class-validator';

export class CreateProjectIndicatorYearTargetDto {
    @IsInt({ message: 'El año debe ser un número entero' })
    @IsNotEmpty({ message: 'El año es requerido' })
    year: number;

    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El valor meta debe ser un número con hasta 2 decimales' },
    )
    @IsNotEmpty({ message: 'El valor meta es requerido' })
    @Min(0, { message: 'El valor meta no puede ser menor a 0' })
    targetValue: number;
}

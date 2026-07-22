import {
    IsNotEmpty,
    IsInt,
} from 'class-validator';

export class CreateProjectProgramDto {
    @IsInt({ message: 'El ID del programa debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID del programa es requerido' })
    programId: number;
}

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsInt,
    IsBoolean,
    IsDateString,
    IsEnum,
    MaxLength,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
    @IsInt({ message: 'El ID de la organización debe ser un número entero' })
    @IsNotEmpty({ message: 'El ID de la organización es requerido' })
    organizationId: number;

    @IsString({ message: 'El código debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El código es requerido' })
    @MaxLength(30, { message: 'El código no puede exceder los 30 caracteres' })
    code: string;

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MaxLength(200, { message: 'El nombre no puede exceder los 200 caracteres' })
    name: string;

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    description?: string;

    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
    startDate: string;

    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de fin es requerida' })
    endDate: string;

    @IsEnum(ProjectStatus, {
        message: 'El estado debe ser DRAFT, ACTIVE, SUSPENDED o CLOSED',
    })
    @IsOptional()
    status?: ProjectStatus;

    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    active?: boolean;
}

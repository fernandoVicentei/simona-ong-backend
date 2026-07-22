import {
    IsOptional,
    IsString,
    IsInt,
    IsBoolean,
    IsDateString,
    IsEnum,
    MaxLength,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class UpdateProjectDto {
    @IsInt({ message: 'El ID de la organización debe ser un número entero' })
    @IsOptional()
    organizationId?: number;

    @IsString({ message: 'El código debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(30, { message: 'El código no puede exceder los 30 caracteres' })
    code?: string;

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsOptional()
    @MaxLength(200, { message: 'El nombre no puede exceder los 200 caracteres' })
    name?: string;

    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsOptional()
    description?: string;

    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    @IsOptional()
    startDate?: string;

    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    @IsOptional()
    endDate?: string;

    @IsEnum(ProjectStatus, {
        message: 'El estado debe ser DRAFT, ACTIVE, SUSPENDED o CLOSED',
    })
    @IsOptional()
    status?: ProjectStatus;

    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    @IsOptional()
    active?: boolean;
}

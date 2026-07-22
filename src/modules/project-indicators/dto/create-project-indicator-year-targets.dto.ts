import {
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectIndicatorYearTargetDto } from './create-project-indicator-year-target.dto';

export class CreateProjectIndicatorYearTargetsDto {
    @IsArray({ message: 'Los targets deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un target anual' })
    @ValidateNested({ each: true })
    @Type(() => CreateProjectIndicatorYearTargetDto)
    targets: CreateProjectIndicatorYearTargetDto[];
}

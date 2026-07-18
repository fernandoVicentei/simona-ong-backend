import {
    ArrayMinSize,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateYearTargetDto } from './create-year-target.dto';

export class CreateYearTargetsDto {
    @IsArray({ message: 'Los targets deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe proporcionar al menos un target anual' })
    @ValidateNested({ each: true })
    @Type(() => CreateYearTargetDto)
    targets: CreateYearTargetDto[];
}

import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterAuditLogDto {
  @IsString()
  @IsOptional()
  module?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}

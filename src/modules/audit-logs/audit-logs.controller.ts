import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { AuditLog } from './entities/audit-log.entity';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async findAll(@Query() filter: FilterAuditLogDto): Promise<
    ApiResponse<{
      data: AuditLog[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    const result = await this.auditLogsService.findAll(filter);
    return successResponse(
      result,
      'Listado de auditoría obtenido exitosamente',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<AuditLog>> {
    const data = await this.auditLogsService.findOne(id);
    return successResponse(data, 'Registro de auditoría obtenido exitosamente');
  }
}

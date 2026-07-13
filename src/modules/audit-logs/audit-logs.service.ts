import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Between, Like } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(
    filter: FilterAuditLogDto,
  ): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> {
    const { module, action, userId, page = 1, limit = 20 } = filter;

    const where: any = {};

    if (module) {
      where.module = module;
    }

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    const [data, total] = await this.auditLogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findOne({ where: { id } });

    if (!auditLog) {
      throw new NotFoundException(
        `El registro de auditoría con ID ${id} no fue encontrado`,
      );
    }

    return auditLog;
  }

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(auditLog);
  }
}

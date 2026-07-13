import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`El permiso con ID ${id} no fue encontrado`);
    }

    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    await this.ensureCodeNotExists(createPermissionDto.code);

    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    if (
      updatePermissionDto.code &&
      updatePermissionDto.code !== permission.code
    ) {
      await this.ensureCodeNotExists(updatePermissionDto.code);
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }

  private async ensureCodeNotExists(code: string): Promise<void> {
    const existing = await this.permissionRepository.findOne({
      where: { code },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un permiso con el código "${code}"`,
      );
    }
  }
}

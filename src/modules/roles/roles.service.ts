import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`El rol con ID ${id} no fue encontrado`);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    await this.ensureNameNotExists(createRoleDto.name);

    const { permissionIds, ...roleData } = createRoleDto;
    const role = this.roleRepository.create(roleData);
    const savedRole = await this.roleRepository.save(role);

    if (permissionIds && permissionIds.length > 0) {
      await this.assignPermissionsToRole(savedRole.id, permissionIds);
    }

    return this.findOne(savedRole.id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      await this.ensureNameNotExists(updateRoleDto.name);
    }

    const { permissionIds, ...rawRoleData } = updateRoleDto;

    const roleData = Object.fromEntries(
      Object.entries(rawRoleData).filter(([, value]) => value !== undefined),
    );

    Object.assign(role, roleData);
    await this.roleRepository.save(role);

    if (permissionIds !== undefined) {
      await this.rolePermissionRepository.delete({ role: { id } });

      if (permissionIds.length > 0) {
        await this.assignPermissionsToRole(id, permissionIds);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);

    await this.rolePermissionRepository.delete({ role: { id } });
    await this.roleRepository.remove(role);
  }

  async findPermissions(id: number): Promise<Permission[]> {
    await this.findOne(id);

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { id } },
      relations: ['permission'],
    });

    return rolePermissions.map((rp) => rp.permission);
  }

  async assignPermissions(
    id: number,
    permissionIds: number[],
  ): Promise<Permission[]> {
    await this.findOne(id);

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('Uno o más permisos no fueron encontrados');
    }

    await this.rolePermissionRepository.delete({ role: { id } });
    await this.assignPermissionsToRole(id, permissionIds);

    return this.findPermissions(id);
  }

  private async assignPermissionsToRole(
    roleId: number,
    permissionIds: number[],
  ): Promise<void> {
    const rolePermissions = permissionIds.map((permissionId) => {
      const rp = new RolePermission();
      rp.role = { id: roleId } as any;
      rp.permission = { id: permissionId } as any;
      return rp;
    });

    await this.rolePermissionRepository.save(rolePermissions);
  }

  private async ensureNameNotExists(name: string): Promise<void> {
    const existing = await this.roleRepository.findOne({
      where: { name },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un rol con el nombre "${name}"`);
    }
  }
}

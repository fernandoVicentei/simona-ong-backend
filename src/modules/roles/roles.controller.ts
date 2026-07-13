import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Role[]>> {
    const data = await this.rolesService.findAll();
    return successResponse(data, 'Listado de roles obtenido exitosamente');
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Role>> {
    const data = await this.rolesService.findOne(id);
    return successResponse(data, 'Rol obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<ApiResponse<Role>> {
    const data = await this.rolesService.create(createRoleDto);
    return successResponse(data, 'Rol creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ApiResponse<Role>> {
    const data = await this.rolesService.update(id, updateRoleDto);
    return successResponse(data, 'Rol actualizado exitosamente');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.rolesService.remove(id);
    return successResponse(null, 'Rol eliminado exitosamente');
  }

  @Get(':id/permissions')
  async findPermissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Permission[]>> {
    const data = await this.rolesService.findPermissions(id);
    return successResponse(data, 'Permisos del rol obtenidos exitosamente');
  }

  @Post(':id/permissions')
  async assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body('permissionIds') permissionIds: number[],
  ): Promise<ApiResponse<Permission[]>> {
    const data = await this.rolesService.assignPermissions(id, permissionIds);
    return successResponse(data, 'Permisos asignados al rol exitosamente');
  }
}

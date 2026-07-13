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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Permission } from './entities/permission.entity';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Permission[]>> {
    const data = await this.permissionsService.findAll();
    return successResponse(data, 'Listado de permisos obtenido exitosamente');
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Permission>> {
    const data = await this.permissionsService.findOne(id);
    return successResponse(data, 'Permiso obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<ApiResponse<Permission>> {
    const data = await this.permissionsService.create(createPermissionDto);
    return successResponse(data, 'Permiso creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<ApiResponse<Permission>> {
    const data = await this.permissionsService.update(id, updatePermissionDto);
    return successResponse(data, 'Permiso actualizado exitosamente');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.permissionsService.remove(id);
    return successResponse(null, 'Permiso eliminado exitosamente');
  }
}

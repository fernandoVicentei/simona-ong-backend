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
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Organization[]>> {
    const data = await this.organizationsService.findAll();
    return successResponse(
      data,
      'Listado de organizaciones obtenido exitosamente',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Organization>> {
    const data = await this.organizationsService.findOne(id);
    return successResponse(data, 'Organización obtenida exitosamente');
  }

  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<ApiResponse<Organization>> {
    const data = await this.organizationsService.create(createOrganizationDto);
    return successResponse(data, 'Organización creada exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<ApiResponse<Organization>> {
    const data = await this.organizationsService.update(
      id,
      updateOrganizationDto,
    );
    return successResponse(data, 'Organización actualizada exitosamente');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.organizationsService.remove(id);
    return successResponse(null, 'Organización eliminada exitosamente');
  }

  @Get(':id/users')
  async findUsers(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<User[]>> {
    const data = await this.organizationsService.findUsers(id);
    return successResponse(
      data,
      'Usuarios de la organización obtenidos exitosamente',
    );
  }

  @Post(':id/users')
  async assignUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body('userIds') userIds: number[],
  ): Promise<ApiResponse<User[]>> {
    const data = await this.organizationsService.assignUsers(id, userIds);
    return successResponse(
      data,
      'Usuarios asignados a la organización exitosamente',
    );
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { ProjectActivity } from './entities/project-activity.entity';

@Controller('project-activities')
export class ProjectActivitiesController {
  constructor(
    private readonly projectActivitiesService: ProjectActivitiesService,
  ) {}

  @Get()
  async findAll(
    @Query('projectId') projectId?: string,
  ): Promise<ApiResponse<ProjectActivity[]>> {
    const data = await this.projectActivitiesService.findAll(
      projectId ? Number(projectId) : undefined,
    );
    return successResponse(
      data,
      'Listado de actividades de proyecto obtenido exitosamente',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectActivity>> {
    const data = await this.projectActivitiesService.findOne(id);
    return successResponse(data, 'Actividad del proyecto obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createProjectActivityDto: CreateProjectActivityDto,
  ): Promise<ApiResponse<ProjectActivity>> {
    const data = await this.projectActivitiesService.create(
      createProjectActivityDto,
    );
    return successResponse(data, 'Actividad del proyecto creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectActivityDto: UpdateProjectActivityDto,
  ): Promise<ApiResponse<ProjectActivity>> {
    const data = await this.projectActivitiesService.update(
      id,
      updateProjectActivityDto,
    );
    return successResponse(
      data,
      'Actividad del proyecto actualizada exitosamente',
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.projectActivitiesService.remove(id);
    return successResponse(null, 'Actividad del proyecto eliminada exitosamente');
  }
}

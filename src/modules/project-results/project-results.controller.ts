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
import { ProjectResultsService } from './project-results.service';
import { CreateProjectResultDto } from './dto/create-project-result.dto';
import { UpdateProjectResultDto } from './dto/update-project-result.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { ProjectResult } from './entities/project-result.entity';

@Controller('project-results')
export class ProjectResultsController {
  constructor(
    private readonly projectResultsService: ProjectResultsService,
  ) {}

  @Get()
  async findAll(
    @Query('projectObjectiveId') projectObjectiveId?: string,
    @Query('projectId') projectId?: string,
  ): Promise<ApiResponse<ProjectResult[]>> {
    const data = await this.projectResultsService.findAll(
      projectObjectiveId ? Number(projectObjectiveId) : undefined,
      projectId ? Number(projectId) : undefined,
    );
    return successResponse(
      data,
      'Listado de resultados de proyecto obtenido exitosamente',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectResult>> {
    const data = await this.projectResultsService.findOne(id);
    return successResponse(data, 'Resultado del proyecto obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createProjectResultDto: CreateProjectResultDto,
  ): Promise<ApiResponse<ProjectResult>> {
    const data = await this.projectResultsService.create(createProjectResultDto);
    return successResponse(data, 'Resultado del proyecto creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectResultDto: UpdateProjectResultDto,
  ): Promise<ApiResponse<ProjectResult>> {
    const data = await this.projectResultsService.update(
      id,
      updateProjectResultDto,
    );
    return successResponse(
      data,
      'Resultado del proyecto actualizado exitosamente',
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.projectResultsService.remove(id);
    return successResponse(null, 'Resultado del proyecto eliminado exitosamente');
  }
}

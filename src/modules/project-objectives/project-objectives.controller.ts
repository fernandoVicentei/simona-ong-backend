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
import { ProjectObjectivesService } from './project-objectives.service';
import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { ProjectObjective } from './entities/project-objective.entity';

@Controller('project-objectives')
export class ProjectObjectivesController {
  constructor(
    private readonly projectObjectivesService: ProjectObjectivesService,
  ) {}

  @Get()
  async findAll(): Promise<ApiResponse<ProjectObjective[]>> {
    const data = await this.projectObjectivesService.findAll();
    return successResponse(
      data,
      'Listado de objetivos de proyecto obtenido exitosamente',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectObjective>> {
    const data = await this.projectObjectivesService.findOne(id);
    return successResponse(data, 'Objetivo del proyecto obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createProjectObjectiveDto: CreateProjectObjectiveDto,
  ): Promise<ApiResponse<ProjectObjective>> {
    const data = await this.projectObjectivesService.create(
      createProjectObjectiveDto,
    );
    return successResponse(data, 'Objetivo del proyecto creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectObjectiveDto: UpdateProjectObjectiveDto,
  ): Promise<ApiResponse<ProjectObjective>> {
    const data = await this.projectObjectivesService.update(
      id,
      updateProjectObjectiveDto,
    );
    return successResponse(
      data,
      'Objetivo del proyecto actualizado exitosamente',
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.projectObjectivesService.remove(id);
    return successResponse(null, 'Objetivo del proyecto eliminado exitosamente');
  }
}

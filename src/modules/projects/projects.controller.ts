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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectProgramDto } from './dto/create-project-program.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Project } from './entities/project.entity';
import { ProjectProgram } from './entities/project-program.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Project[]>> {
    const data = await this.projectsService.findAll();
    return successResponse(data, 'Listado de proyectos obtenido exitosamente');
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Project>> {
    const data = await this.projectsService.findOne(id);
    return successResponse(data, 'Proyecto obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ApiResponse<Project>> {
    const data = await this.projectsService.create(createProjectDto);
    return successResponse(data, 'Proyecto creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ApiResponse<Project>> {
    const data = await this.projectsService.update(id, updateProjectDto);
    return successResponse(data, 'Proyecto actualizado exitosamente');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.projectsService.remove(id);
    return successResponse(null, 'Proyecto eliminado exitosamente');
  }

  // ─── Relación con Programas ──────────────────────────────────────────────────

  @Get(':id/programs')
  async findPrograms(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectProgram[]>> {
    const data = await this.projectsService.findPrograms(id);
    return successResponse(
      data,
      'Listado de programas asociados al proyecto obtenido exitosamente',
    );
  }

  @Post(':id/programs')
  async addProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProjectProgramDto: CreateProjectProgramDto,
  ): Promise<ApiResponse<ProjectProgram>> {
    const data = await this.projectsService.addProgram(
      id,
      createProjectProgramDto.programId,
    );
    return successResponse(data, 'Programa asociado al proyecto exitosamente');
  }

  @Delete(':id/programs/:programId')
  async removeProgram(
    @Param('id', ParseIntPipe) id: number,
    @Param('programId', ParseIntPipe) programId: number,
  ): Promise<ApiResponse<null>> {
    await this.projectsService.removeProgram(id, programId);
    return successResponse(null, 'Programa desasociado del proyecto exitosamente');
  }
}

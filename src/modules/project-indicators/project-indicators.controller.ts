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
import { ProjectIndicatorsService } from './project-indicators.service';
import { CreateProjectIndicatorDto } from './dto/create-project-indicator.dto';
import { UpdateProjectIndicatorDto } from './dto/update-project-indicator.dto';
import { CreateProjectIndicatorYearTargetsDto } from './dto/create-project-indicator-year-targets.dto';
import { UpdateProjectIndicatorYearTargetDto } from './dto/update-project-indicator-year-target.dto';
import { CreateProjectIndicatorProgressDto } from './dto/create-project-indicator-progress.dto';
import { CreateProjectIndicatorAlignmentDto } from './dto/create-project-indicator-alignment.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { ProjectIndicator, ProjectIndicatorType } from './entities/project-indicator.entity';
import { ProjectIndicatorYearTarget } from './entities/project-indicator-year-target.entity';
import { ProjectIndicatorProgress } from './entities/project-indicator-progress.entity';
import { ProjectIndicatorAlignment } from './entities/project-indicator-alignment.entity';

@Controller('project-indicators')
export class ProjectIndicatorsController {
  constructor(
    private readonly projectIndicatorsService: ProjectIndicatorsService,
  ) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('projectObjectiveId') projectObjectiveId?: string,
    @Query('projectResultId') projectResultId?: string,
    @Query('projectActivityId') projectActivityId?: string,
  ): Promise<ApiResponse<ProjectIndicator[]>> {
    const filters: any = {};
    if (type) filters.type = type;
    if (projectObjectiveId) filters.projectObjectiveId = Number(projectObjectiveId);
    if (projectResultId) filters.projectResultId = Number(projectResultId);
    if (projectActivityId) filters.projectActivityId = Number(projectActivityId);

    console.log('[ProjectIndicatorsController.findAll] filters:', filters);
    const data = await this.projectIndicatorsService.findAll(
      Object.keys(filters).length > 0 ? filters : undefined,
    );
    console.log('[ProjectIndicatorsController.findAll] returned:', data.length, 'indicators');
    return successResponse(data, 'Listado de indicadores de proyecto obtenido exitosamente');
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectIndicator>> {
    const data = await this.projectIndicatorsService.findOne(id);
    return successResponse(data, 'Indicador del proyecto obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createProjectIndicatorDto: CreateProjectIndicatorDto,
  ): Promise<ApiResponse<ProjectIndicator>> {
    const data = await this.projectIndicatorsService.create(createProjectIndicatorDto);
    return successResponse(data, 'Indicador del proyecto creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectIndicatorDto: UpdateProjectIndicatorDto,
  ): Promise<ApiResponse<ProjectIndicator>> {
    const data = await this.projectIndicatorsService.update(id, updateProjectIndicatorDto);
    return successResponse(data, 'Indicador del proyecto actualizado exitosamente');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.projectIndicatorsService.remove(id);
    return successResponse(null, 'Indicador del proyecto eliminado exitosamente');
  }

  // ─── Year Targets ─────────────────────────────────────────────────────────

  @Post(':id/year-targets/generate')
  async generateYearTargets(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectIndicatorYearTarget[]>> {
    const data = await this.projectIndicatorsService.generateYearTargets(id);
    return successResponse(
      data,
      'Targets anuales generados exitosamente desde la vigencia del proyecto',
    );
  }

  @Post(':id/year-targets')
  async createYearTargets(
    @Param('id', ParseIntPipe) id: number,
    @Body() createYearTargetsDto: CreateProjectIndicatorYearTargetsDto,
  ): Promise<ApiResponse<ProjectIndicatorYearTarget[]>> {
    const data = await this.projectIndicatorsService.createYearTargets(
      id,
      createYearTargetsDto,
    );
    return successResponse(data, 'Targets anuales creados exitosamente');
  }

  @Get(':id/year-targets')
  async findYearTargets(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectIndicatorYearTarget[]>> {
    const data = await this.projectIndicatorsService.findYearTargets(id);
    return successResponse(data, 'Targets anuales obtenidos exitosamente');
  }

  @Patch('year-targets/:yearTargetId')
  async updateYearTarget(
    @Param('yearTargetId', ParseIntPipe) yearTargetId: number,
    @Body() updateYearTargetDto: UpdateProjectIndicatorYearTargetDto,
  ): Promise<ApiResponse<ProjectIndicatorYearTarget>> {
    const data = await this.projectIndicatorsService.updateYearTarget(
      yearTargetId,
      updateYearTargetDto,
    );
    return successResponse(data, 'Target anual actualizado exitosamente');
  }

  @Delete('year-targets/:yearTargetId')
  async removeYearTarget(
    @Param('yearTargetId', ParseIntPipe) yearTargetId: number,
  ): Promise<ApiResponse<null>> {
    await this.projectIndicatorsService.removeYearTarget(yearTargetId);
    return successResponse(null, 'Target anual eliminado exitosamente');
  }

  // ─── Progress Tracking ─────────────────────────────────────────────────────────

  @Post(':id/progress')
  async addProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProgressDto: CreateProjectIndicatorProgressDto,
    @GetUser('id') userId: number | null,
  ): Promise<ApiResponse<ProjectIndicatorProgress>> {
    const data = await this.projectIndicatorsService.addProgress(
      id,
      createProgressDto,
      userId,
    );
    return successResponse(data, 'Progreso registrado exitosamente');
  }

  @Get(':id/progress')
  async findProgress(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectIndicatorProgress[]>> {
    const data = await this.projectIndicatorsService.findProgress(id);
    return successResponse(data, 'Listado de progresos obtenido exitosamente');
  }

  @Delete('progress/:progressId')
  async removeProgress(
    @Param('progressId', ParseIntPipe) progressId: number,
  ): Promise<ApiResponse<null>> {
    await this.projectIndicatorsService.removeProgress(progressId);
    return successResponse(null, 'Registro de progreso eliminado exitosamente');
  }

  // ─── Strategic Alignment ──────────────────────────────────────────────────

  @Post(':id/alignment')
  async alignIndicator(
    @Param('id', ParseIntPipe) id: number,
    @Body() createAlignmentDto: CreateProjectIndicatorAlignmentDto,
  ): Promise<ApiResponse<ProjectIndicatorAlignment>> {
    const data = await this.projectIndicatorsService.alignIndicator(
      id,
      createAlignmentDto,
    );
    return successResponse(data, 'Alineación estratégica creada exitosamente');
  }

  @Delete(':id/alignment')
  async removeAlignment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.projectIndicatorsService.removeAlignment(id);
    return successResponse(null, 'Alineación estratégica eliminada exitosamente');
  }

  @Get(':id/alignment')
  async findAlignment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<ProjectIndicatorAlignment | null>> {
    const data = await this.projectIndicatorsService.findAlignment(id);
    return successResponse(data, 'Alineación estratégica obtenida exitosamente');
  }
}

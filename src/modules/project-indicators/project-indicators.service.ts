import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectIndicator, ProjectIndicatorType } from './entities/project-indicator.entity';
import { ProjectIndicatorYearTarget } from './entities/project-indicator-year-target.entity';
import { ProjectIndicatorProgress } from './entities/project-indicator-progress.entity';
import { ProjectIndicatorAlignment } from './entities/project-indicator-alignment.entity';
import { IndicatorProgress } from '../indicators/entities/indicator-progress.entity';

import { ProjectObjectivesService } from '../project-objectives/project-objectives.service';
import { ProjectResultsService } from '../project-results/project-results.service';
import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import { ProjectsService } from '../projects/projects.service';
import { IndicatorsService } from '../indicators/indicators.service';

import { CreateProjectIndicatorDto } from './dto/create-project-indicator.dto';
import { UpdateProjectIndicatorDto } from './dto/update-project-indicator.dto';
import { CreateProjectIndicatorYearTargetsDto } from './dto/create-project-indicator-year-targets.dto';
import { UpdateProjectIndicatorYearTargetDto } from './dto/update-project-indicator-year-target.dto';
import { CreateProjectIndicatorProgressDto } from './dto/create-project-indicator-progress.dto';
import { CreateProjectIndicatorAlignmentDto } from './dto/create-project-indicator-alignment.dto';

@Injectable()
export class ProjectIndicatorsService {
  constructor(
    @InjectRepository(ProjectIndicator)
    private readonly indicatorRepository: Repository<ProjectIndicator>,
    @InjectRepository(ProjectIndicatorYearTarget)
    private readonly yearTargetRepository: Repository<ProjectIndicatorYearTarget>,
    @InjectRepository(ProjectIndicatorProgress)
    private readonly progressRepository: Repository<ProjectIndicatorProgress>,
    @InjectRepository(ProjectIndicatorAlignment)
    private readonly alignmentRepository: Repository<ProjectIndicatorAlignment>,
    @InjectRepository(IndicatorProgress)
    private readonly strategicProgressRepository: Repository<IndicatorProgress>,

    private readonly projectObjectivesService: ProjectObjectivesService,
    private readonly projectResultsService: ProjectResultsService,
    @Inject(forwardRef(() => ProjectActivitiesService))
    private readonly projectActivitiesService: ProjectActivitiesService,
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => IndicatorsService))
    private readonly indicatorsService: IndicatorsService,
  ) {}

  async findAll(filters?: {
    type?: ProjectIndicatorType;
    projectObjectiveId?: number;
    projectResultId?: number;
    projectActivityId?: number;
  }): Promise<ProjectIndicator[]> {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.projectObjectiveId !== undefined) where.projectObjectiveId = filters.projectObjectiveId;
    if (filters?.projectResultId !== undefined) where.projectResultId = filters.projectResultId;
    if (filters?.projectActivityId !== undefined) where.projectActivityId = filters.projectActivityId;

    return this.indicatorRepository.find({
      where: Object.keys(where).length > 0 ? where : undefined,
      order: { id: 'ASC' },
      relations: ['projectObjective', 'projectResult', 'projectActivity', 'yearTargets', 'alignments'],
    });
  }

  async findOne(id: number): Promise<ProjectIndicator> {
    const indicator = await this.indicatorRepository.findOne({
      where: { id },
      relations: ['projectObjective', 'projectResult', 'projectActivity', 'yearTargets', 'alignments'],
    });

    if (!indicator) {
      throw new NotFoundException(`El indicador del proyecto con ID ${id} no fue encontrado`);
    }

    return indicator;
  }

  async create(createProjectIndicatorDto: CreateProjectIndicatorDto): Promise<ProjectIndicator> {
    const { type, projectObjectiveId, projectResultId, projectActivityId, code } = createProjectIndicatorDto;

    this.validateTypeRelation(type, projectObjectiveId, projectResultId, projectActivityId);
    await this.validateParentExists(type, projectObjectiveId, projectResultId, projectActivityId);
    await this.ensureCodeNotExists(code);

    const indicator = this.indicatorRepository.create(createProjectIndicatorDto);
    const saved = await this.indicatorRepository.save(indicator);

    await this.generateYearTargets(saved.id);

    return this.findOne(saved.id);
  }

  async update(id: number, updateProjectIndicatorDto: UpdateProjectIndicatorDto): Promise<ProjectIndicator> {
    const indicator = await this.findOne(id);

    const type = updateProjectIndicatorDto.type ?? indicator.type;
    const projectObjectiveId =
      updateProjectIndicatorDto.projectObjectiveId !== undefined
        ? updateProjectIndicatorDto.projectObjectiveId
        : indicator.projectObjectiveId;
    const projectResultId =
      updateProjectIndicatorDto.projectResultId !== undefined
        ? updateProjectIndicatorDto.projectResultId
        : indicator.projectResultId;
    const projectActivityId =
      updateProjectIndicatorDto.projectActivityId !== undefined
        ? updateProjectIndicatorDto.projectActivityId
        : indicator.projectActivityId;

    const typeChanged =
      updateProjectIndicatorDto.type !== undefined &&
      updateProjectIndicatorDto.type !== indicator.type;
    const relationChanged =
      (updateProjectIndicatorDto.projectObjectiveId !== undefined &&
        updateProjectIndicatorDto.projectObjectiveId !== indicator.projectObjectiveId) ||
      (updateProjectIndicatorDto.projectResultId !== undefined &&
        updateProjectIndicatorDto.projectResultId !== indicator.projectResultId) ||
      (updateProjectIndicatorDto.projectActivityId !== undefined &&
        updateProjectIndicatorDto.projectActivityId !== indicator.projectActivityId);

    if (typeChanged || relationChanged) {
      this.validateTypeRelation(type, projectObjectiveId, projectResultId, projectActivityId);
      await this.validateParentExists(type, projectObjectiveId, projectResultId, projectActivityId);
    }

    if (
      updateProjectIndicatorDto.code !== undefined &&
      updateProjectIndicatorDto.code !== indicator.code
    ) {
      await this.ensureCodeNotExists(updateProjectIndicatorDto.code);
    }

    const { ...indicatorData } = updateProjectIndicatorDto;

    const cleanData = Object.fromEntries(
      Object.entries(indicatorData).filter(([, value]) => value !== undefined),
    );

    Object.assign(indicator, cleanData);
    return this.indicatorRepository.save(indicator);
  }

  async remove(id: number): Promise<void> {
    const indicator = await this.findOne(id);
    await this.indicatorRepository.remove(indicator);
  }

  // ─── Year Targets ─────────────────────────────────────────────────────────

  async generateYearTargets(indicatorId: number): Promise<ProjectIndicatorYearTarget[]> {
    const indicator = await this.findOne(indicatorId);

    let projectId: number;

    if (indicator.type === ProjectIndicatorType.OBJECTIVE) {
      const objective = await this.projectObjectivesService.findOne(indicator.projectObjectiveId!);
      projectId = objective.projectId;
    } else if (indicator.type === ProjectIndicatorType.RESULT) {
      const result = await this.projectResultsService.findOne(indicator.projectResultId!);
      const objective = await this.projectObjectivesService.findOne(result.projectObjectiveId);
      projectId = objective.projectId;
    } else {
      const activity = await this.projectActivitiesService.findOne(indicator.projectActivityId!);
      const result = await this.projectResultsService.findOne(activity.projectResultId);
      const objective = await this.projectObjectivesService.findOne(result.projectObjectiveId);
      projectId = objective.projectId;
    }

    const project = await this.projectsService.findOne(projectId);
    const startYear = new Date(project.startDate).getFullYear();
    const endYear = new Date(project.endDate).getFullYear();

    const created: ProjectIndicatorYearTarget[] = [];
    for (let year = startYear; year <= endYear; year++) {
      const existing = await this.yearTargetRepository.findOne({
        where: { indicatorId, year },
      });
      if (existing) {
        created.push(existing);
        continue;
      }
      const target = this.yearTargetRepository.create({
        indicatorId,
        year,
        targetValue: 0,
      });
      created.push(await this.yearTargetRepository.save(target));
    }

    return created;
  }

  async createYearTargets(
    indicatorId: number,
    createYearTargetsDto: CreateProjectIndicatorYearTargetsDto,
  ): Promise<ProjectIndicatorYearTarget[]> {
    await this.findOne(indicatorId);

    const created: ProjectIndicatorYearTarget[] = [];
    for (const dto of createYearTargetsDto.targets) {
      const existing = await this.yearTargetRepository.findOne({
        where: { indicatorId, year: dto.year },
      });
      if (existing) {
        throw new ConflictException(
          `Ya existe un target anual para el año ${dto.year} en este indicador`,
        );
      }
      const target = this.yearTargetRepository.create({
        indicatorId,
        year: dto.year,
        targetValue: dto.targetValue,
      });
      created.push(await this.yearTargetRepository.save(target));
    }

    return created;
  }

  async findYearTargets(indicatorId: number): Promise<ProjectIndicatorYearTarget[]> {
    await this.findOne(indicatorId);

    return this.yearTargetRepository.find({
      where: { indicatorId },
      order: { year: 'ASC' },
    });
  }

  async updateYearTarget(
    id: number,
    updateYearTargetDto: UpdateProjectIndicatorYearTargetDto,
  ): Promise<ProjectIndicatorYearTarget> {
    const target = await this.yearTargetRepository.findOne({
      where: { id },
    });

    if (!target) {
      throw new NotFoundException(`El target anual con ID ${id} no fue encontrado`);
    }

    const cleanData = Object.fromEntries(
      Object.entries(updateYearTargetDto).filter(([, value]) => value !== undefined),
    );

    Object.assign(target, cleanData);
    return this.yearTargetRepository.save(target);
  }

  async removeYearTarget(id: number): Promise<void> {
    const target = await this.yearTargetRepository.findOne({
      where: { id },
    });

    if (!target) {
      throw new NotFoundException(`El target anual con ID ${id} no fue encontrado`);
    }

    await this.yearTargetRepository.remove(target);
  }

  // ─── Progress Tracking & Strategic Alignment Sync ──────────────────────────

  async addProgress(
    indicatorId: number,
    dto: CreateProjectIndicatorProgressDto,
    userId: number | null,
  ): Promise<ProjectIndicatorProgress> {
    await this.findOne(indicatorId);

    const progress = this.progressRepository.create({
      indicatorId,
      progressDate: new Date(dto.progressDate),
      currentValue: dto.currentValue,
      observations: dto.observations,
      registeredBy: userId,
    });

    const saved = await this.progressRepository.save(progress);

    // Sincronizar con el indicador estratégico si existe una alineación
    await this.syncStrategicProgress(
      indicatorId,
      saved.progressDate,
      saved.currentValue,
      saved.observations,
      userId,
    );

    return saved;
  }

  async findProgress(indicatorId: number): Promise<ProjectIndicatorProgress[]> {
    await this.findOne(indicatorId);
    return this.progressRepository.find({
      where: { indicatorId },
      order: { progressDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async removeProgress(progressId: number): Promise<void> {
    const progress = await this.progressRepository.findOne({
      where: { id: progressId },
    });

    if (!progress) {
      throw new NotFoundException(`El registro de progreso con ID ${progressId} no fue encontrado`);
    }

    await this.progressRepository.remove(progress);
  }

  async syncStrategicProgress(
    projectIndicatorId: number,
    progressDate: Date,
    currentValue: number,
    observations: string,
    userId: number | null,
  ): Promise<void> {
    const alignment = await this.alignmentRepository.findOne({
      where: { projectIndicatorId },
    });

    if (alignment) {
      const strategicProgress = this.strategicProgressRepository.create({
        indicatorId: alignment.strategicIndicatorId,
        progressDate,
        currentValue,
        observations: `[Proyecto] ${observations || ''}`,
        registeredBy: userId || 1,
      });
      await this.strategicProgressRepository.save(strategicProgress);
    }
  }

  // ─── Indicator Alignment ──────────────────────────────────────────────────

  async alignIndicator(
    projectIndicatorId: number,
    dto: CreateProjectIndicatorAlignmentDto,
  ): Promise<ProjectIndicatorAlignment> {
    await this.findOne(projectIndicatorId);
    await this.indicatorsService.findOne(dto.strategicIndicatorId);

    const existing = await this.alignmentRepository.findOne({
      where: { projectIndicatorId },
    });

    if (existing) {
      throw new ConflictException(
        `El indicador de proyecto ${projectIndicatorId} ya está alineado con un indicador estratégico`,
      );
    }

    const alignment = this.alignmentRepository.create({
      projectIndicatorId,
      strategicIndicatorId: dto.strategicIndicatorId,
    });

    return this.alignmentRepository.save(alignment);
  }

  async removeAlignment(projectIndicatorId: number): Promise<void> {
    await this.findOne(projectIndicatorId);

    const alignment = await this.alignmentRepository.findOne({
      where: { projectIndicatorId },
    });

    if (!alignment) {
      throw new NotFoundException(
        `El indicador de proyecto ${projectIndicatorId} no tiene ninguna alineación estratégica activa`,
      );
    }

    await this.alignmentRepository.remove(alignment);
  }

  async findAlignment(projectIndicatorId: number): Promise<ProjectIndicatorAlignment | null> {
    await this.findOne(projectIndicatorId);
    return this.alignmentRepository.findOne({
      where: { projectIndicatorId },
      relations: ['strategicIndicator'],
    });
  }

  // ─── Helpers & Validations ──────────────────────────────────────────────────

  private validateTypeRelation(
    type: ProjectIndicatorType,
    projectObjectiveId: number | null | undefined,
    projectResultId: number | null | undefined,
    projectActivityId: number | null | undefined,
  ): void {
    const hasObjective = projectObjectiveId !== undefined && projectObjectiveId !== null;
    const hasResult = projectResultId !== undefined && projectResultId !== null;
    const hasActivity = projectActivityId !== undefined && projectActivityId !== null;

    const providedCount =
      (hasObjective ? 1 : 0) +
      (hasResult ? 1 : 0) +
      (hasActivity ? 1 : 0);

    if (providedCount !== 1) {
      throw new BadRequestException(
        'El indicador del proyecto debe estar asociado exactamente a un objetivo, resultado o actividad',
      );
    }

    if (type === ProjectIndicatorType.OBJECTIVE && !hasObjective) {
      throw new BadRequestException(
        'Un indicador de tipo OBJECTIVE debe estar asociado a un objetivo de proyecto',
      );
    }
    if (type === ProjectIndicatorType.RESULT && !hasResult) {
      throw new BadRequestException(
        'Un indicador de tipo RESULT debe estar asociado a un resultado de proyecto',
      );
    }
    if (type === ProjectIndicatorType.ACTIVITY && !hasActivity) {
      throw new BadRequestException(
        'Un indicador de tipo ACTIVITY debe estar asociado a una actividad de proyecto',
      );
    }
  }

  private async validateParentExists(
    type: ProjectIndicatorType,
    projectObjectiveId: number | null | undefined,
    projectResultId: number | null | undefined,
    projectActivityId: number | null | undefined,
  ): Promise<void> {
    switch (type) {
      case ProjectIndicatorType.OBJECTIVE:
        await this.projectObjectivesService.findOne(projectObjectiveId!);
        break;
      case ProjectIndicatorType.RESULT:
        await this.projectResultsService.findOne(projectResultId!);
        break;
      case ProjectIndicatorType.ACTIVITY:
        await this.projectActivitiesService.findOne(projectActivityId!);
        break;
    }
  }

  private async ensureCodeNotExists(code: string): Promise<void> {
    const existing = await this.indicatorRepository.findOne({
      where: { code },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un indicador con el código "${code}"`);
    }
  }
}

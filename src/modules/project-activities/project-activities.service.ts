import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProjectActivity } from './entities/project-activity.entity';
import { ProjectResultsService } from '../project-results/project-results.service';
import { ProjectIndicatorsService } from '../project-indicators/project-indicators.service';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';

@Injectable()
export class ProjectActivitiesService {
  constructor(
    @InjectRepository(ProjectActivity)
    private readonly projectActivityRepository: Repository<ProjectActivity>,
    private readonly projectResultsService: ProjectResultsService,
    @Inject(forwardRef(() => ProjectIndicatorsService))
    private readonly projectIndicatorsService: ProjectIndicatorsService,
  ) {}

  async findAll(projectId?: number): Promise<ProjectActivity[]> {
    if (projectId) {
      const results = await this.projectResultsService.findAll(undefined, projectId);
      const resultIds = results.map((r) => r.id);
      return this.projectActivityRepository.find({
        where: { projectResultId: In(resultIds) },
        order: { id: 'ASC' },
        relations: ['result', 'objectiveIndicator', 'resultIndicator'],
      });
    }
    return this.projectActivityRepository.find({
      order: { id: 'ASC' },
      relations: ['result', 'objectiveIndicator', 'resultIndicator'],
    });
  }

  async findOne(id: number): Promise<ProjectActivity> {
    const activity = await this.projectActivityRepository.findOne({
      where: { id },
      relations: ['result', 'objectiveIndicator', 'resultIndicator'],
    });

    if (!activity) {
      throw new NotFoundException(
        `La actividad del proyecto con ID ${id} no fue encontrada`,
      );
    }

    return activity;
  }

  async create(
    createProjectActivityDto: CreateProjectActivityDto,
  ): Promise<ProjectActivity> {
    const { projectResultId, code, objectiveIndicatorId, resultIndicatorId } =
      createProjectActivityDto;

    await this.projectResultsService.findOne(projectResultId);

    await this.ensureCodeNotExistsInResult(projectResultId, code);

    if (objectiveIndicatorId) {
      await this.projectIndicatorsService.findOne(objectiveIndicatorId);
    }
    if (resultIndicatorId) {
      await this.projectIndicatorsService.findOne(resultIndicatorId);
    }

    const activity = this.projectActivityRepository.create(
      createProjectActivityDto,
    );
    return this.projectActivityRepository.save(activity);
  }

  async update(
    id: number,
    updateProjectActivityDto: UpdateProjectActivityDto,
  ): Promise<ProjectActivity> {
    const activity = await this.findOne(id);

    const projectResultId =
      updateProjectActivityDto.projectResultId !== undefined
        ? updateProjectActivityDto.projectResultId
        : activity.projectResultId;

    if (
      updateProjectActivityDto.projectResultId !== undefined &&
      updateProjectActivityDto.projectResultId !== activity.projectResultId
    ) {
      await this.projectResultsService.findOne(
        updateProjectActivityDto.projectResultId,
      );
    }

    if (
      updateProjectActivityDto.code !== undefined &&
      updateProjectActivityDto.code !== activity.code
    ) {
      await this.ensureCodeNotExistsInResult(
        projectResultId,
        updateProjectActivityDto.code,
      );
    }

    if (
      updateProjectActivityDto.objectiveIndicatorId !== undefined &&
      updateProjectActivityDto.objectiveIndicatorId !==
        activity.objectiveIndicatorId
    ) {
      if (updateProjectActivityDto.objectiveIndicatorId !== null) {
        await this.projectIndicatorsService.findOne(
          updateProjectActivityDto.objectiveIndicatorId,
        );
      }
    }
    if (
      updateProjectActivityDto.resultIndicatorId !== undefined &&
      updateProjectActivityDto.resultIndicatorId !== activity.resultIndicatorId
    ) {
      if (updateProjectActivityDto.resultIndicatorId !== null) {
        await this.projectIndicatorsService.findOne(
          updateProjectActivityDto.resultIndicatorId,
        );
      }
    }

    const { ...activityData } = updateProjectActivityDto;

    const cleanData = Object.fromEntries(
      Object.entries(activityData).filter(([, value]) => value !== undefined),
    );

    Object.assign(activity, cleanData);
    return this.projectActivityRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.findOne(id);
    await this.projectActivityRepository.remove(activity);
  }

  private async ensureCodeNotExistsInResult(
    projectResultId: number,
    code: string,
  ): Promise<void> {
    const existing = await this.projectActivityRepository.findOne({
      where: { projectResultId, code },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una actividad con el código "${code}" en este resultado del proyecto`,
      );
    }
  }
}

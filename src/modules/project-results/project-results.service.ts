import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectResult } from './entities/project-result.entity';
import { ProjectObjectivesService } from '../project-objectives/project-objectives.service';
import { CreateProjectResultDto } from './dto/create-project-result.dto';
import { UpdateProjectResultDto } from './dto/update-project-result.dto';

@Injectable()
export class ProjectResultsService {
  constructor(
    @InjectRepository(ProjectResult)
    private readonly projectResultRepository: Repository<ProjectResult>,
    private readonly projectObjectivesService: ProjectObjectivesService,
  ) {}

  async findAll(): Promise<ProjectResult[]> {
    return this.projectResultRepository.find({
      order: { id: 'ASC' },
      relations: ['objective'],
    });
  }

  async findOne(id: number): Promise<ProjectResult> {
    const result = await this.projectResultRepository.findOne({
      where: { id },
      relations: ['objective'],
    });

    if (!result) {
      throw new NotFoundException(
        `El resultado del proyecto con ID ${id} no fue encontrado`,
      );
    }

    return result;
  }

  async create(createProjectResultDto: CreateProjectResultDto): Promise<ProjectResult> {
    const { projectObjectiveId, code } = createProjectResultDto;

    await this.projectObjectivesService.findOne(projectObjectiveId);

    // Enforce 1:1 validation before save
    const existingResult = await this.projectResultRepository.findOne({
      where: { projectObjectiveId },
    });
    if (existingResult) {
      throw new ConflictException(
        `El objetivo del proyecto con ID ${projectObjectiveId} ya tiene un resultado asociado`,
      );
    }

    await this.ensureCodeNotExistsInObjective(projectObjectiveId, code);

    const result = this.projectResultRepository.create(createProjectResultDto);
    return this.projectResultRepository.save(result);
  }

  async update(
    id: number,
    updateProjectResultDto: UpdateProjectResultDto,
  ): Promise<ProjectResult> {
    const result = await this.findOne(id);

    const projectObjectiveId =
      updateProjectResultDto.projectObjectiveId !== undefined
        ? updateProjectResultDto.projectObjectiveId
        : result.projectObjectiveId;

    if (
      updateProjectResultDto.projectObjectiveId !== undefined &&
      updateProjectResultDto.projectObjectiveId !== result.projectObjectiveId
    ) {
      await this.projectObjectivesService.findOne(
        updateProjectResultDto.projectObjectiveId,
      );

      // Enforce 1:1 check if objective changes
      const existingResult = await this.projectResultRepository.findOne({
        where: { projectObjectiveId: updateProjectResultDto.projectObjectiveId },
      });
      if (existingResult) {
        throw new ConflictException(
          `El objetivo del proyecto con ID ${updateProjectResultDto.projectObjectiveId} ya tiene un resultado asociado`,
        );
      }
    }

    if (
      updateProjectResultDto.code !== undefined &&
      updateProjectResultDto.code !== result.code
    ) {
      await this.ensureCodeNotExistsInObjective(
        projectObjectiveId,
        updateProjectResultDto.code,
      );
    }

    const { ...resultData } = updateProjectResultDto;

    const cleanData = Object.fromEntries(
      Object.entries(resultData).filter(([, value]) => value !== undefined),
    );

    Object.assign(result, cleanData);
    return this.projectResultRepository.save(result);
  }

  async remove(id: number): Promise<void> {
    const result = await this.findOne(id);
    await this.projectResultRepository.remove(result);
  }

  private async ensureCodeNotExistsInObjective(
    projectObjectiveId: number,
    code: string,
  ): Promise<void> {
    const existing = await this.projectResultRepository.findOne({
      where: { projectObjectiveId, code },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un resultado con el código "${code}" en este objetivo del proyecto`,
      );
    }
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectObjective } from './entities/project-objective.entity';
import { ProjectsService } from '../projects/projects.service';
import { CreateProjectObjectiveDto } from './dto/create-project-objective.dto';
import { UpdateProjectObjectiveDto } from './dto/update-project-objective.dto';

@Injectable()
export class ProjectObjectivesService {
  constructor(
    @InjectRepository(ProjectObjective)
    private readonly projectObjectiveRepository: Repository<ProjectObjective>,
    private readonly projectsService: ProjectsService,
  ) {}

  async findAll(): Promise<ProjectObjective[]> {
    return this.projectObjectiveRepository.find({
      order: { id: 'ASC' },
      relations: ['project'],
    });
  }

  async findOne(id: number): Promise<ProjectObjective> {
    const objective = await this.projectObjectiveRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!objective) {
      throw new NotFoundException(
        `El objetivo del proyecto con ID ${id} no fue encontrado`,
      );
    }

    return objective;
  }

  async create(
    createProjectObjectiveDto: CreateProjectObjectiveDto,
  ): Promise<ProjectObjective> {
    const { projectId, code } = createProjectObjectiveDto;

    await this.projectsService.findOne(projectId);

    await this.ensureCodeNotExistsInProject(projectId, code);

    const objective = this.projectObjectiveRepository.create(
      createProjectObjectiveDto,
    );
    return this.projectObjectiveRepository.save(objective);
  }

  async update(
    id: number,
    updateProjectObjectiveDto: UpdateProjectObjectiveDto,
  ): Promise<ProjectObjective> {
    const objective = await this.findOne(id);

    const projectId =
      updateProjectObjectiveDto.projectId !== undefined
        ? updateProjectObjectiveDto.projectId
        : objective.projectId;

    if (
      updateProjectObjectiveDto.projectId !== undefined &&
      updateProjectObjectiveDto.projectId !== objective.projectId
    ) {
      await this.projectsService.findOne(updateProjectObjectiveDto.projectId);
    }

    if (
      updateProjectObjectiveDto.code !== undefined &&
      updateProjectObjectiveDto.code !== objective.code
    ) {
      await this.ensureCodeNotExistsInProject(projectId, updateProjectObjectiveDto.code);
    }

    const { ...objectiveData } = updateProjectObjectiveDto;

    const cleanData = Object.fromEntries(
      Object.entries(objectiveData).filter(([, value]) => value !== undefined),
    );

    Object.assign(objective, cleanData);
    return this.projectObjectiveRepository.save(objective);
  }

  async remove(id: number): Promise<void> {
    const objective = await this.findOne(id);
    await this.projectObjectiveRepository.remove(objective);
  }

  private async ensureCodeNotExistsInProject(
    projectId: number,
    code: string,
  ): Promise<void> {
    const existing = await this.projectObjectiveRepository.findOne({
      where: { projectId, code },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un objetivo con el código "${code}" en este proyecto`,
      );
    }
  }
}

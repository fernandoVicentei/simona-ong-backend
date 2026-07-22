import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectProgram } from './entities/project-program.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProgramsService } from '../programs/programs.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectProgram)
    private readonly projectProgramRepository: Repository<ProjectProgram>,
    private readonly organizationsService: OrganizationsService,
    private readonly programsService: ProgramsService,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      order: { id: 'ASC' },
      relations: ['organization', 'projectPrograms', 'projectPrograms.program'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['organization', 'projectPrograms', 'projectPrograms.program'],
    });

    if (!project) {
      throw new NotFoundException(`El proyecto con ID ${id} no fue encontrado`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { organizationId, code, startDate, endDate } = createProjectDto;

    this.validateDates(startDate, endDate);

    // Validar organización existente
    await this.organizationsService.findOne(organizationId);

    // Validar unicidad del código
    await this.ensureCodeNotExists(code);

    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    const organizationId =
      updateProjectDto.organizationId !== undefined
        ? updateProjectDto.organizationId
        : project.organizationId;

    const startDate =
      updateProjectDto.startDate !== undefined
        ? updateProjectDto.startDate
        : project.startDate.toString();

    const endDate =
      updateProjectDto.endDate !== undefined
        ? updateProjectDto.endDate
        : project.endDate.toString();

    this.validateDates(startDate, endDate);

    // Si cambia de organización, validar existencia
    if (
      updateProjectDto.organizationId !== undefined &&
      updateProjectDto.organizationId !== project.organizationId
    ) {
      await this.organizationsService.findOne(updateProjectDto.organizationId);
    }

    // Si cambia de código, validar unicidad
    if (
      updateProjectDto.code !== undefined &&
      updateProjectDto.code !== project.code
    ) {
      await this.ensureCodeNotExists(updateProjectDto.code);
    }

    const { ...projectData } = updateProjectDto;

    const cleanData = Object.fromEntries(
      Object.entries(projectData).filter(([, value]) => value !== undefined),
    );

    Object.assign(project, cleanData);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  // ─── Relación con Programas ──────────────────────────────────────────────────

  async findPrograms(projectId: number): Promise<ProjectProgram[]> {
    await this.findOne(projectId);
    return this.projectProgramRepository.find({
      where: { projectId },
      relations: ['program', 'strategicPlan'],
    });
  }

  async addProgram(projectId: number, programId: number): Promise<ProjectProgram> {
    const project = await this.findOne(projectId);
    const program = await this.programsService.findOne(programId);

    // Verificar si ya está asociado
    const existing = await this.projectProgramRepository.findOne({
      where: { projectId, programId },
    });

    if (existing) {
      throw new ConflictException(
        `El programa con ID ${programId} ya está asociado al proyecto con ID ${projectId}`,
      );
    }

    const projectProgram = this.projectProgramRepository.create({
      projectId,
      programId,
      strategicPlanId: program.strategicPlanId,
    });

    return this.projectProgramRepository.save(projectProgram);
  }

  async removeProgram(projectId: number, programId: number): Promise<void> {
    await this.findOne(projectId);
    await this.programsService.findOne(programId);

    const projectProgram = await this.projectProgramRepository.findOne({
      where: { projectId, programId },
    });

    if (!projectProgram) {
      throw new NotFoundException(
        `La relación entre el proyecto ${projectId} y el programa ${programId} no existe`,
      );
    }

    await this.projectProgramRepository.remove(projectProgram);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private validateDates(startDate: string, endDate: string): void {
    if (new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException(
        'La fecha de fin no puede ser menor que la fecha de inicio',
      );
    }
  }

  private async ensureCodeNotExists(code: string): Promise<void> {
    const existing = await this.projectRepository.findOne({
      where: { code },
    });

    if (existing) {
      throw new ConflictException(`Ya existe un proyecto con el código "${code}"`);
    }
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategicPlan } from './entities/strategic-plan.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateStrategicPlanDto } from './dto/create-strategic-plan.dto';
import { UpdateStrategicPlanDto } from './dto/update-strategic-plan.dto';

@Injectable()
export class StrategicPlansService {
  constructor(
    @InjectRepository(StrategicPlan)
    private readonly strategicPlanRepository: Repository<StrategicPlan>,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async findAll(): Promise<StrategicPlan[]> {
    return this.strategicPlanRepository.find({
      order: { id: 'ASC' },
      relations: ['organization'],
    });
  }

  async findOne(id: number): Promise<StrategicPlan> {
    const strategicPlan = await this.strategicPlanRepository.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!strategicPlan) {
      throw new NotFoundException(
        `El plan estratégico con ID ${id} no fue encontrado`,
      );
    }

    return strategicPlan;
  }

  async create(
    createStrategicPlanDto: CreateStrategicPlanDto,
  ): Promise<StrategicPlan> {
    const { organizationId, code, startYear, endYear } = createStrategicPlanDto;

    // Validar periodo
    if (endYear < startYear) {
      throw new BadRequestException(
        'El año de fin no puede ser menor que el año de inicio',
      );
    }

    // Validar organización existente
    await this.organizationsService.findOne(organizationId);

    // Validar unicidad del código
    await this.ensureCodeNotExists(code);

    // Validar unicidad del periodo para esa organización
    await this.ensurePeriodNotExists(organizationId, startYear, endYear);

    const strategicPlan = this.strategicPlanRepository.create(
      createStrategicPlanDto,
    );
    return this.strategicPlanRepository.save(strategicPlan);
  }

  async update(
    id: number,
    updateStrategicPlanDto: UpdateStrategicPlanDto,
  ): Promise<StrategicPlan> {
    const plan = await this.findOne(id);

    const organizationId =
      updateStrategicPlanDto.organizationId !== undefined
        ? updateStrategicPlanDto.organizationId
        : plan.organizationId;

    const startYear =
      updateStrategicPlanDto.startYear !== undefined
        ? updateStrategicPlanDto.startYear
        : plan.startYear;

    const endYear =
      updateStrategicPlanDto.endYear !== undefined
        ? updateStrategicPlanDto.endYear
        : plan.endYear;

    // Validar periodo
    if (endYear < startYear) {
      throw new BadRequestException(
        'El año de fin no puede ser menor que el año de inicio',
      );
    }

    // Si cambia de organización, validar existencia
    if (
      updateStrategicPlanDto.organizationId !== undefined &&
      updateStrategicPlanDto.organizationId !== plan.organizationId
    ) {
      await this.organizationsService.findOne(updateStrategicPlanDto.organizationId);
    }

    // Si cambia de código, validar unicidad
    if (
      updateStrategicPlanDto.code !== undefined &&
      updateStrategicPlanDto.code !== plan.code
    ) {
      await this.ensureCodeNotExists(updateStrategicPlanDto.code);
    }

    // Si cambia organización o años, validar periodo único
    if (
      (updateStrategicPlanDto.organizationId !== undefined &&
        updateStrategicPlanDto.organizationId !== plan.organizationId) ||
      (updateStrategicPlanDto.startYear !== undefined &&
        updateStrategicPlanDto.startYear !== plan.startYear) ||
      (updateStrategicPlanDto.endYear !== undefined &&
        updateStrategicPlanDto.endYear !== plan.endYear)
    ) {
      await this.ensurePeriodNotExists(organizationId, startYear, endYear);
    }

    const { ...planData } = updateStrategicPlanDto;

    const cleanData = Object.fromEntries(
      Object.entries(planData).filter(([, value]) => value !== undefined),
    );

    Object.assign(plan, cleanData);
    return this.strategicPlanRepository.save(plan);
  }

  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id);
    // Hard delete como solicitó el usuario
    await this.strategicPlanRepository.remove(plan);
  }

  private async ensureCodeNotExists(code: string): Promise<void> {
    const existing = await this.strategicPlanRepository.findOne({
      where: { code },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un plan estratégico con el código "${code}"`,
      );
    }
  }

  private async ensurePeriodNotExists(
    organizationId: number,
    startYear: number,
    endYear: number,
  ): Promise<void> {
    const existing = await this.strategicPlanRepository.findOne({
      where: {
        organizationId,
        startYear,
        endYear,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un plan estratégico registrado para esta organización en el periodo ${startYear} - ${endYear}`,
      );
    }
  }
}

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
import {
    Indicator,
    IndicatorType,
} from './entities/indicator.entity';
import { IndicatorYearTarget } from './entities/indicator-year-target.entity';
import { ObjectivesService } from '../objectives/objectives.service';
import { ResultsService } from '../results/results.service';
import { ActivitiesService } from '../activities/activities.service';
import { ProgramsService } from '../programs/programs.service';
import { StrategicPlansService } from '../strategic-plans/strategic-plans.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { CreateYearTargetDto } from './dto/create-year-target.dto';
import { CreateYearTargetsDto } from './dto/create-year-targets.dto';
import { UpdateYearTargetDto } from './dto/update-year-target.dto';

@Injectable()
export class IndicatorsService {
    constructor(
        @InjectRepository(Indicator)
        private readonly indicatorRepository: Repository<Indicator>,
        @InjectRepository(IndicatorYearTarget)
        private readonly yearTargetRepository: Repository<IndicatorYearTarget>,
        private readonly objectivesService: ObjectivesService,
        private readonly resultsService: ResultsService,
        @Inject(forwardRef(() => ActivitiesService))
        private readonly activitiesService: ActivitiesService,
        private readonly programsService: ProgramsService,
        private readonly strategicPlansService: StrategicPlansService,
    ) {}

    async findAll(filters?: {
        type?: IndicatorType;
        objectiveId?: number;
        resultId?: number;
        activityId?: number;
    }): Promise<Indicator[]> {
        const where: any = {};
        if (filters?.type) where.type = filters.type;
        if (filters?.objectiveId !== undefined) where.objectiveId = filters.objectiveId;
        if (filters?.resultId !== undefined) where.resultId = filters.resultId;
        if (filters?.activityId !== undefined) where.activityId = filters.activityId;

        return this.indicatorRepository.find({
            where: Object.keys(where).length > 0 ? where : undefined,
            order: { id: 'ASC' },
            relations: ['objective', 'result', 'activity', 'yearTargets'],
        });
    }

    async findOne(id: number): Promise<Indicator> {
        const indicator = await this.indicatorRepository.findOne({
            where: { id },
            relations: ['objective', 'result', 'activity', 'yearTargets'],
        });

        if (!indicator) {
            throw new NotFoundException(
                `El indicador con ID ${id} no fue encontrado`,
            );
        }

        return indicator;
    }

    async create(createIndicatorDto: CreateIndicatorDto): Promise<Indicator> {
        const { type, objectiveId, resultId, activityId, code } =
            createIndicatorDto;

        this.validateTypeRelation(type, objectiveId, resultId, activityId);

        await this.validateParentExists(type, objectiveId, resultId, activityId);

        await this.ensureCodeNotExists(code);

        const indicator = this.indicatorRepository.create(createIndicatorDto);
        const saved = await this.indicatorRepository.save(indicator);

        await this.generateYearTargets(saved.id);

        return this.findOne(saved.id);
    }

    async update(
        id: number,
        updateIndicatorDto: UpdateIndicatorDto,
    ): Promise<Indicator> {
        const indicator = await this.findOne(id);

        const type = updateIndicatorDto.type ?? indicator.type;
        const objectiveId =
            updateIndicatorDto.objectiveId !== undefined
                ? updateIndicatorDto.objectiveId
                : indicator.objectiveId;
        const resultId =
            updateIndicatorDto.resultId !== undefined
                ? updateIndicatorDto.resultId
                : indicator.resultId;
        const activityId =
            updateIndicatorDto.activityId !== undefined
                ? updateIndicatorDto.activityId
                : indicator.activityId;

        const typeChanged =
            updateIndicatorDto.type !== undefined &&
            updateIndicatorDto.type !== indicator.type;
        const relationChanged =
            (updateIndicatorDto.objectiveId !== undefined &&
                updateIndicatorDto.objectiveId !== indicator.objectiveId) ||
            (updateIndicatorDto.resultId !== undefined &&
                updateIndicatorDto.resultId !== indicator.resultId) ||
            (updateIndicatorDto.activityId !== undefined &&
                updateIndicatorDto.activityId !== indicator.activityId);

        if (typeChanged || relationChanged) {
            this.validateTypeRelation(type, objectiveId, resultId, activityId);
            await this.validateParentExists(
                type,
                objectiveId,
                resultId,
                activityId,
            );
        }

        if (
            updateIndicatorDto.code !== undefined &&
            updateIndicatorDto.code !== indicator.code
        ) {
            await this.ensureCodeNotExists(updateIndicatorDto.code);
        }

        const { ...indicatorData } = updateIndicatorDto;

        const cleanData = Object.fromEntries(
            Object.entries(indicatorData).filter(
                ([, value]) => value !== undefined,
            ),
        );

        Object.assign(indicator, cleanData);
        return this.indicatorRepository.save(indicator);
    }

    async remove(id: number): Promise<void> {
        const indicator = await this.findOne(id);
        await this.indicatorRepository.remove(indicator);
    }

    // ─── Year targets ─────────────────────────────────────────────────────────

    async generateYearTargets(indicatorId: number): Promise<IndicatorYearTarget[]> {
        const indicator = await this.findOne(indicatorId);

        let programId: number;

        if (indicator.type === IndicatorType.OBJECTIVE) {
            const objective = await this.objectivesService.findOne(indicator.objectiveId!);
            programId = objective.programId;
        } else if (indicator.type === IndicatorType.RESULT) {
            const result = await this.resultsService.findOne(indicator.resultId!);
            const objective = await this.objectivesService.findOne(result.objectiveId);
            programId = objective.programId;
        } else {
            const activity = await this.activitiesService.findOne(indicator.activityId!);
            const result = await this.resultsService.findOne(activity.resultId);
            const objective = await this.objectivesService.findOne(result.objectiveId);
            programId = objective.programId;
        }

        const program = await this.programsService.findOne(programId);
        const plan = await this.strategicPlansService.findOne(program.strategicPlanId);

        const created: IndicatorYearTarget[] = [];
        for (let year = plan.startYear; year <= plan.endYear; year++) {
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
        createYearTargetsDto: CreateYearTargetsDto,
    ): Promise<IndicatorYearTarget[]> {
        await this.findOne(indicatorId);

        const created: IndicatorYearTarget[] = [];
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

    async findYearTargets(indicatorId: number): Promise<IndicatorYearTarget[]> {
        await this.findOne(indicatorId);

        return this.yearTargetRepository.find({
            where: { indicatorId },
            order: { year: 'ASC' },
        });
    }

    async updateYearTarget(
        id: number,
        updateYearTargetDto: UpdateYearTargetDto,
    ): Promise<IndicatorYearTarget> {
        const target = await this.yearTargetRepository.findOne({
            where: { id },
        });

        if (!target) {
            throw new NotFoundException(
                `El target anual con ID ${id} no fue encontrado`,
            );
        }

        const cleanData = Object.fromEntries(
            Object.entries(updateYearTargetDto).filter(
                ([, value]) => value !== undefined,
            ),
        );

        Object.assign(target, cleanData);
        return this.yearTargetRepository.save(target);
    }

    async removeYearTarget(id: number): Promise<void> {
        const target = await this.yearTargetRepository.findOne({
            where: { id },
        });

        if (!target) {
            throw new NotFoundException(
                `El target anual con ID ${id} no fue encontrado`,
            );
        }

        await this.yearTargetRepository.remove(target);
    }

    private validateTypeRelation(
        type: IndicatorType,
        objectiveId: number | null | undefined,
        resultId: number | null | undefined,
        activityId: number | null | undefined,
    ): void {
        const hasObjective = objectiveId !== undefined && objectiveId !== null;
        const hasResult = resultId !== undefined && resultId !== null;
        const hasActivity =
            activityId !== undefined && activityId !== null;

        const providedCount =
            (hasObjective ? 1 : 0) +
            (hasResult ? 1 : 0) +
            (hasActivity ? 1 : 0);

        if (providedCount !== 1) {
            throw new BadRequestException(
                'El indicador debe estar asociado exactamente a un objetivo, resultado o actividad',
            );
        }

        if (type === IndicatorType.OBJECTIVE && !hasObjective) {
            throw new BadRequestException(
                'Un indicador de tipo OBJECTIVE debe estar asociado a un objetivo',
            );
        }
        if (type === IndicatorType.RESULT && !hasResult) {
            throw new BadRequestException(
                'Un indicador de tipo RESULT debe estar asociado a un resultado',
            );
        }
        if (type === IndicatorType.ACTIVITY && !hasActivity) {
            throw new BadRequestException(
                'Un indicador de tipo ACTIVITY debe estar asociado a una actividad',
            );
        }
    }

    private async validateParentExists(
        type: IndicatorType,
        objectiveId: number | null | undefined,
        resultId: number | null | undefined,
        activityId: number | null | undefined,
    ): Promise<void> {
        switch (type) {
            case IndicatorType.OBJECTIVE:
                await this.objectivesService.findOne(objectiveId!);
                break;
            case IndicatorType.RESULT:
                await this.resultsService.findOne(resultId!);
                break;
            case IndicatorType.ACTIVITY:
                await this.activitiesService.findOne(activityId!);
                break;
        }
    }

    private async ensureCodeNotExists(code: string): Promise<void> {
        const existing = await this.indicatorRepository.findOne({
            where: { code },
        });

        if (existing) {
            throw new ConflictException(
                `Ya existe un indicador con el código "${code}"`,
            );
        }
    }
}

import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    Indicator,
    IndicatorType,
} from './entities/indicator.entity';
import { ObjectivesService } from '../objectives/objectives.service';
import { ResultsService } from '../results/results.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';

@Injectable()
export class IndicatorsService {
    constructor(
        @InjectRepository(Indicator)
        private readonly indicatorRepository: Repository<Indicator>,
        private readonly objectivesService: ObjectivesService,
        private readonly resultsService: ResultsService,
        private readonly activitiesService: ActivitiesService,
    ) {}

    async findAll(): Promise<Indicator[]> {
        return this.indicatorRepository.find({
            order: { id: 'ASC' },
            relations: ['objective', 'result', 'activity'],
        });
    }

    async findOne(id: number): Promise<Indicator> {
        const indicator = await this.indicatorRepository.findOne({
            where: { id },
            relations: ['objective', 'result', 'activity'],
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
        return this.indicatorRepository.save(indicator);
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

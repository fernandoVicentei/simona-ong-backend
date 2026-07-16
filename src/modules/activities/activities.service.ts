import {
    Injectable,
    NotFoundException,
    ConflictException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ResultsService } from '../results/results.service';
import { IndicatorsService } from '../indicators/indicators.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
        private readonly resultsService: ResultsService,
        @Inject(forwardRef(() => IndicatorsService))
        private readonly indicatorsService: IndicatorsService,
    ) {}

    async findAll(): Promise<Activity[]> {
        return this.activityRepository.find({
            order: { id: 'ASC' },
            relations: ['result', 'objectiveIndicator', 'resultIndicator'],
        });
    }

    async findOne(id: number): Promise<Activity> {
        const activity = await this.activityRepository.findOne({
            where: { id },
            relations: ['result', 'objectiveIndicator', 'resultIndicator'],
        });

        if (!activity) {
            throw new NotFoundException(
                `La actividad con ID ${id} no fue encontrada`,
            );
        }

        return activity;
    }

    async create(createActivityDto: CreateActivityDto): Promise<Activity> {
        const { resultId, code, objectiveIndicatorId, resultIndicatorId } =
            createActivityDto;

        await this.resultsService.findOne(resultId);

        await this.ensureCodeNotExistsInResult(resultId, code);

        if (objectiveIndicatorId !== undefined) {
            await this.indicatorsService.findOne(objectiveIndicatorId);
        }
        if (resultIndicatorId !== undefined) {
            await this.indicatorsService.findOne(resultIndicatorId);
        }

        const activity = this.activityRepository.create(createActivityDto);
        return this.activityRepository.save(activity);
    }

    async update(
        id: number,
        updateActivityDto: UpdateActivityDto,
    ): Promise<Activity> {
        const activity = await this.findOne(id);

        const resultId =
            updateActivityDto.resultId !== undefined
                ? updateActivityDto.resultId
                : activity.resultId;

        if (
            updateActivityDto.resultId !== undefined &&
            updateActivityDto.resultId !== activity.resultId
        ) {
            await this.resultsService.findOne(
                updateActivityDto.resultId,
            );
        }

        if (
            updateActivityDto.code !== undefined &&
            updateActivityDto.code !== activity.code
        ) {
            await this.ensureCodeNotExistsInResult(
                resultId,
                updateActivityDto.code,
            );
        }

        if (
            updateActivityDto.objectiveIndicatorId !== undefined &&
            updateActivityDto.objectiveIndicatorId !==
                activity.objectiveIndicatorId
        ) {
            await this.indicatorsService.findOne(
                updateActivityDto.objectiveIndicatorId,
            );
        }
        if (
            updateActivityDto.resultIndicatorId !== undefined &&
            updateActivityDto.resultIndicatorId !== activity.resultIndicatorId
        ) {
            await this.indicatorsService.findOne(
                updateActivityDto.resultIndicatorId,
            );
        }

        const { ...activityData } = updateActivityDto;

        const cleanData = Object.fromEntries(
            Object.entries(activityData).filter(
                ([, value]) => value !== undefined,
            ),
        );

        Object.assign(activity, cleanData);
        return this.activityRepository.save(activity);
    }

    async remove(id: number): Promise<void> {
        const activity = await this.findOne(id);
        await this.activityRepository.remove(activity);
    }

    private async ensureCodeNotExistsInResult(
        resultId: number,
        code: string,
    ): Promise<void> {
        const existing = await this.activityRepository.findOne({
            where: { resultId, code },
        });

        if (existing) {
            throw new ConflictException(
                `Ya existe una actividad con el código "${code}" en este resultado`,
            );
        }
    }
}

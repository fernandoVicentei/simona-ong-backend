import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ResultsService } from '../results/results.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
        private readonly resultsService: ResultsService,
    ) {}

    async findAll(): Promise<Activity[]> {
        return this.activityRepository.find({
            order: { id: 'ASC' },
            relations: ['result'],
        });
    }

    async findOne(id: number): Promise<Activity> {
        const activity = await this.activityRepository.findOne({
            where: { id },
            relations: ['result'],
        });

        if (!activity) {
            throw new NotFoundException(
                `La actividad con ID ${id} no fue encontrada`,
            );
        }

        return activity;
    }

    async create(createActivityDto: CreateActivityDto): Promise<Activity> {
        const { resultId, code } = createActivityDto;

        await this.resultsService.findOne(resultId);

        await this.ensureCodeNotExistsInResult(resultId, code);

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

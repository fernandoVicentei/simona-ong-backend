import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { ObjectivesService } from '../objectives/objectives.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
    constructor(
        @InjectRepository(Result)
        private readonly resultRepository: Repository<Result>,
        private readonly objectivesService: ObjectivesService,
    ) {}

    async findAll(): Promise<Result[]> {
        return this.resultRepository.find({
            order: { id: 'ASC' },
            relations: ['objective'],
        });
    }

    async findOne(id: number): Promise<Result> {
        const result = await this.resultRepository.findOne({
            where: { id },
            relations: ['objective'],
        });

        if (!result) {
            throw new NotFoundException(
                `El resultado con ID ${id} no fue encontrado`,
            );
        }

        return result;
    }

    async create(createResultDto: CreateResultDto): Promise<Result> {
        const { objectiveId, code } = createResultDto;

        await this.objectivesService.findOne(objectiveId);

        await this.ensureCodeNotExistsInObjective(objectiveId, code);

        const result = this.resultRepository.create(createResultDto);
        return this.resultRepository.save(result);
    }

    async update(
        id: number,
        updateResultDto: UpdateResultDto,
    ): Promise<Result> {
        const result = await this.findOne(id);

        const objectiveId =
            updateResultDto.objectiveId !== undefined
                ? updateResultDto.objectiveId
                : result.objectiveId;

        if (
            updateResultDto.objectiveId !== undefined &&
            updateResultDto.objectiveId !== result.objectiveId
        ) {
            await this.objectivesService.findOne(
                updateResultDto.objectiveId,
            );
        }

        if (
            updateResultDto.code !== undefined &&
            updateResultDto.code !== result.code
        ) {
            await this.ensureCodeNotExistsInObjective(
                objectiveId,
                updateResultDto.code,
            );
        }

        const { ...resultData } = updateResultDto;

        const cleanData = Object.fromEntries(
            Object.entries(resultData).filter(
                ([, value]) => value !== undefined,
            ),
        );

        Object.assign(result, cleanData);
        return this.resultRepository.save(result);
    }

    async remove(id: number): Promise<void> {
        const result = await this.findOne(id);
        await this.resultRepository.remove(result);
    }

    private async ensureCodeNotExistsInObjective(
        objectiveId: number,
        code: string,
    ): Promise<void> {
        const existing = await this.resultRepository.findOne({
            where: { objectiveId, code },
        });

        if (existing) {
            throw new ConflictException(
                `Ya existe un resultado con el código "${code}" en este objetivo`,
            );
        }
    }
}

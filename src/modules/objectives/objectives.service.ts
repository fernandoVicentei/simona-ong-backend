import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Objective } from './entities/objective.entity';
import { ProgramsService } from '../programs/programs.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';

@Injectable()
export class ObjectivesService {
    constructor(
        @InjectRepository(Objective)
        private readonly objectiveRepository: Repository<Objective>,
        private readonly programsService: ProgramsService,
    ) {}

    async findAll(): Promise<Objective[]> {
        return this.objectiveRepository.find({
            order: { id: 'ASC' },
            relations: ['program'],
        });
    }

    async findOne(id: number): Promise<Objective> {
        const objective = await this.objectiveRepository.findOne({
            where: { id },
            relations: ['program'],
        });

        if (!objective) {
            throw new NotFoundException(
                `El objetivo con ID ${id} no fue encontrado`,
            );
        }

        return objective;
    }

    async create(createObjectiveDto: CreateObjectiveDto): Promise<Objective> {
        const { programId, code } = createObjectiveDto;

        await this.programsService.findOne(programId);

        await this.ensureCodeNotExistsInProgram(programId, code);

        const objective = this.objectiveRepository.create(createObjectiveDto);
        return this.objectiveRepository.save(objective);
    }

    async update(
        id: number,
        updateObjectiveDto: UpdateObjectiveDto,
    ): Promise<Objective> {
        const objective = await this.findOne(id);

        const programId =
            updateObjectiveDto.programId !== undefined
                ? updateObjectiveDto.programId
                : objective.programId;

        if (
            updateObjectiveDto.programId !== undefined &&
            updateObjectiveDto.programId !== objective.programId
        ) {
            await this.programsService.findOne(updateObjectiveDto.programId);
        }

        if (
            updateObjectiveDto.code !== undefined &&
            updateObjectiveDto.code !== objective.code
        ) {
            await this.ensureCodeNotExistsInProgram(
                programId,
                updateObjectiveDto.code,
            );
        }

        const { ...objectiveData } = updateObjectiveDto;

        const cleanData = Object.fromEntries(
            Object.entries(objectiveData).filter(
                ([, value]) => value !== undefined,
            ),
        );

        Object.assign(objective, cleanData);
        return this.objectiveRepository.save(objective);
    }

    async remove(id: number): Promise<void> {
        const objective = await this.findOne(id);
        await this.objectiveRepository.remove(objective);
    }

    private async ensureCodeNotExistsInProgram(
        programId: number,
        code: string,
    ): Promise<void> {
        const existing = await this.objectiveRepository.findOne({
            where: { programId, code },
        });

        if (existing) {
            throw new ConflictException(
                `Ya existe un objetivo con el código "${code}" en este programa`,
            );
        }
    }
}

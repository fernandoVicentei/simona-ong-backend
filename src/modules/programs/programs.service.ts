import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { StrategicPlansService } from '../strategic-plans/strategic-plans.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
    constructor(
        @InjectRepository(Program)
        private readonly programRepository: Repository<Program>,
        private readonly strategicPlansService: StrategicPlansService,
    ) {}

    async findAll(): Promise<Program[]> {
        return this.programRepository.find({
            order: { id: 'ASC' },
            relations: ['strategicPlan'],
        });
    }

    async findOne(id: number): Promise<Program> {
        const program = await this.programRepository.findOne({
            where: { id },
            relations: ['strategicPlan'],
        });

        if (!program) {
            throw new NotFoundException(
                `El programa con ID ${id} no fue encontrado`,
            );
        }

        return program;
    }

    async create(createProgramDto: CreateProgramDto): Promise<Program> {
        const { strategicPlanId, code } = createProgramDto;

        await this.strategicPlansService.findOne(strategicPlanId);

        await this.ensureCodeNotExistsInPlan(strategicPlanId, code);

        const program = this.programRepository.create(createProgramDto);
        return this.programRepository.save(program);
    }

    async update(
        id: number,
        updateProgramDto: UpdateProgramDto,
    ): Promise<Program> {
        const program = await this.findOne(id);

        const strategicPlanId =
            updateProgramDto.strategicPlanId !== undefined
                ? updateProgramDto.strategicPlanId
                : program.strategicPlanId;

        if (
            updateProgramDto.strategicPlanId !== undefined &&
            updateProgramDto.strategicPlanId !== program.strategicPlanId
        ) {
            await this.strategicPlansService.findOne(
                updateProgramDto.strategicPlanId,
            );
        }

        if (
            updateProgramDto.code !== undefined &&
            updateProgramDto.code !== program.code
        ) {
            await this.ensureCodeNotExistsInPlan(
                strategicPlanId,
                updateProgramDto.code,
            );
        }

        const { ...programData } = updateProgramDto;

        const cleanData = Object.fromEntries(
            Object.entries(programData).filter(
                ([, value]) => value !== undefined,
            ),
        );

        Object.assign(program, cleanData);
        return this.programRepository.save(program);
    }

    async remove(id: number): Promise<void> {
        const program = await this.findOne(id);
        await this.programRepository.remove(program);
    }

    private async ensureCodeNotExistsInPlan(
        strategicPlanId: number,
        code: string,
    ): Promise<void> {
        const existing = await this.programRepository.findOne({
            where: { strategicPlanId, code },
        });

        if (existing) {
            throw new ConflictException(
                `Ya existe un programa con el código "${code}" en este plan estratégico`,
            );
        }
    }
}

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { UpdateObjectiveDto } from './dto/update-objective.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Objective } from './entities/objective.entity';

@Controller('objectives')
export class ObjectivesController {
    constructor(private readonly objectivesService: ObjectivesService) {}

    @Get()
    async findAll(): Promise<ApiResponse<Objective[]>> {
        const data = await this.objectivesService.findAll();
        return successResponse(
            data,
            'Listado de objetivos obtenido exitosamente',
        );
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<Objective>> {
        const data = await this.objectivesService.findOne(id);
        return successResponse(data, 'Objetivo obtenido exitosamente');
    }

    @Post()
    async create(
        @Body() createObjectiveDto: CreateObjectiveDto,
    ): Promise<ApiResponse<Objective>> {
        const data = await this.objectivesService.create(createObjectiveDto);
        return successResponse(data, 'Objetivo creado exitosamente');
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateObjectiveDto: UpdateObjectiveDto,
    ): Promise<ApiResponse<Objective>> {
        const data = await this.objectivesService.update(
            id,
            updateObjectiveDto,
        );
        return successResponse(data, 'Objetivo actualizado exitosamente');
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<null>> {
        await this.objectivesService.remove(id);
        return successResponse(null, 'Objetivo eliminado exitosamente');
    }
}

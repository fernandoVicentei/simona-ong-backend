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
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Result } from './entities/result.entity';

@Controller('results')
export class ResultsController {
    constructor(private readonly resultsService: ResultsService) {}

    @Get()
    async findAll(): Promise<ApiResponse<Result[]>> {
        const data = await this.resultsService.findAll();
        return successResponse(
            data,
            'Listado de resultados obtenido exitosamente',
        );
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<Result>> {
        const data = await this.resultsService.findOne(id);
        return successResponse(data, 'Resultado obtenido exitosamente');
    }

    @Post()
    async create(
        @Body() createResultDto: CreateResultDto,
    ): Promise<ApiResponse<Result>> {
        const data = await this.resultsService.create(createResultDto);
        return successResponse(data, 'Resultado creado exitosamente');
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateResultDto: UpdateResultDto,
    ): Promise<ApiResponse<Result>> {
        const data = await this.resultsService.update(id, updateResultDto);
        return successResponse(data, 'Resultado actualizado exitosamente');
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<null>> {
        await this.resultsService.remove(id);
        return successResponse(null, 'Resultado eliminado exitosamente');
    }
}

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
import { IndicatorsService } from './indicators.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Indicator } from './entities/indicator.entity';

@Controller('indicators')
export class IndicatorsController {
    constructor(
        private readonly indicatorsService: IndicatorsService,
    ) {}

    @Get()
    async findAll(): Promise<ApiResponse<Indicator[]>> {
        const data = await this.indicatorsService.findAll();
        return successResponse(
            data,
            'Listado de indicadores obtenido exitosamente',
        );
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<Indicator>> {
        const data = await this.indicatorsService.findOne(id);
        return successResponse(data, 'Indicador obtenido exitosamente');
    }

    @Post()
    async create(
        @Body() createIndicatorDto: CreateIndicatorDto,
    ): Promise<ApiResponse<Indicator>> {
        const data = await this.indicatorsService.create(createIndicatorDto);
        return successResponse(data, 'Indicador creado exitosamente');
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateIndicatorDto: UpdateIndicatorDto,
    ): Promise<ApiResponse<Indicator>> {
        const data = await this.indicatorsService.update(
            id,
            updateIndicatorDto,
        );
        return successResponse(data, 'Indicador actualizado exitosamente');
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<null>> {
        await this.indicatorsService.remove(id);
        return successResponse(null, 'Indicador eliminado exitosamente');
    }
}

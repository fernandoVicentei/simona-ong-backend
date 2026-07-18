import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { CreateYearTargetsDto } from './dto/create-year-targets.dto';
import { UpdateYearTargetDto } from './dto/update-year-target.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Indicator } from './entities/indicator.entity';
import { IndicatorYearTarget } from './entities/indicator-year-target.entity';

@Controller('indicators')
export class IndicatorsController {
    constructor(
        private readonly indicatorsService: IndicatorsService,
    ) {}

    @Get()
    async findAll(
        @Query('type') type?: string,
        @Query('objectiveId') objectiveId?: string,
        @Query('resultId') resultId?: string,
        @Query('activityId') activityId?: string,
    ): Promise<ApiResponse<Indicator[]>> {
        const filters: any = {};
        if (type) filters.type = type;
        if (objectiveId) filters.objectiveId = Number(objectiveId);
        if (resultId) filters.resultId = Number(resultId);
        if (activityId) filters.activityId = Number(activityId);

        const data = await this.indicatorsService.findAll(
            Object.keys(filters).length > 0 ? filters : undefined,
        );
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

    // ─── Year Targets ─────────────────────────────────────────────────────────

    @Post(':id/year-targets/generate')
    async generateYearTargets(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<IndicatorYearTarget[]>> {
        const data = await this.indicatorsService.generateYearTargets(id);
        return successResponse(
            data,
            'Targets anuales generados exitosamente desde el plan estratégico',
        );
    }

    @Post(':id/year-targets')
    async createYearTargets(
        @Param('id', ParseIntPipe) id: number,
        @Body() createYearTargetsDto: CreateYearTargetsDto,
    ): Promise<ApiResponse<IndicatorYearTarget[]>> {
        const data = await this.indicatorsService.createYearTargets(
            id,
            createYearTargetsDto,
        );
        return successResponse(
            data,
            'Targets anuales creados exitosamente',
        );
    }

    @Get(':id/year-targets')
    async findYearTargets(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<IndicatorYearTarget[]>> {
        const data = await this.indicatorsService.findYearTargets(id);
        return successResponse(
            data,
            'Targets anuales obtenidos exitosamente',
        );
    }

    @Patch('year-targets/:yearTargetId')
    async updateYearTarget(
        @Param('yearTargetId', ParseIntPipe) yearTargetId: number,
        @Body() updateYearTargetDto: UpdateYearTargetDto,
    ): Promise<ApiResponse<IndicatorYearTarget>> {
        const data = await this.indicatorsService.updateYearTarget(
            yearTargetId,
            updateYearTargetDto,
        );
        return successResponse(
            data,
            'Target anual actualizado exitosamente',
        );
    }

    @Delete('year-targets/:yearTargetId')
    async removeYearTarget(
        @Param('yearTargetId', ParseIntPipe) yearTargetId: number,
    ): Promise<ApiResponse<null>> {
        await this.indicatorsService.removeYearTarget(yearTargetId);
        return successResponse(null, 'Target anual eliminado exitosamente');
    }
}

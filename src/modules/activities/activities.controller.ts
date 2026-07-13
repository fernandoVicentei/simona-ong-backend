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
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Activity } from './entities/activity.entity';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) {}

    @Get()
    async findAll(): Promise<ApiResponse<Activity[]>> {
        const data = await this.activitiesService.findAll();
        return successResponse(
            data,
            'Listado de actividades obtenido exitosamente',
        );
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<Activity>> {
        const data = await this.activitiesService.findOne(id);
        return successResponse(data, 'Actividad obtenida exitosamente');
    }

    @Post()
    async create(
        @Body() createActivityDto: CreateActivityDto,
    ): Promise<ApiResponse<Activity>> {
        const data = await this.activitiesService.create(createActivityDto);
        return successResponse(data, 'Actividad creada exitosamente');
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateActivityDto: UpdateActivityDto,
    ): Promise<ApiResponse<Activity>> {
        const data = await this.activitiesService.update(id, updateActivityDto);
        return successResponse(data, 'Actividad actualizada exitosamente');
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<null>> {
        await this.activitiesService.remove(id);
        return successResponse(null, 'Actividad eliminada exitosamente');
    }
}

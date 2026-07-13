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
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Program } from './entities/program.entity';

@Controller('programs')
export class ProgramsController {
    constructor(private readonly programsService: ProgramsService) {}

    @Get()
    async findAll(): Promise<ApiResponse<Program[]>> {
        const data = await this.programsService.findAll();
        return successResponse(
            data,
            'Listado de programas obtenido exitosamente',
        );
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<Program>> {
        const data = await this.programsService.findOne(id);
        return successResponse(data, 'Programa obtenido exitosamente');
    }

    @Post()
    async create(
        @Body() createProgramDto: CreateProgramDto,
    ): Promise<ApiResponse<Program>> {
        const data = await this.programsService.create(createProgramDto);
        return successResponse(data, 'Programa creado exitosamente');
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProgramDto: UpdateProgramDto,
    ): Promise<ApiResponse<Program>> {
        const data = await this.programsService.update(id, updateProgramDto);
        return successResponse(data, 'Programa actualizado exitosamente');
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<null>> {
        await this.programsService.remove(id);
        return successResponse(null, 'Programa eliminado exitosamente');
    }
}

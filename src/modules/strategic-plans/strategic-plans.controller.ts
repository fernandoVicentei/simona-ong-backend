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
import { StrategicPlansService } from './strategic-plans.service';
import { CreateStrategicPlanDto } from './dto/create-strategic-plan.dto';
import { UpdateStrategicPlanDto } from './dto/update-strategic-plan.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { StrategicPlan } from './entities/strategic-plan.entity';

@Controller('strategic-plans')
export class StrategicPlansController {
  constructor(
    private readonly strategicPlansService: StrategicPlansService,
  ) {}

  @Get()
  async findAll(): Promise<ApiResponse<StrategicPlan[]>> {
    const data = await this.strategicPlansService.findAll();
    return successResponse(
      data,
      'Listado de planes estratégicos obtenido exitosamente',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<StrategicPlan>> {
    const data = await this.strategicPlansService.findOne(id);
    return successResponse(
      data,
      'Plan estratégico obtenido exitosamente',
    );
  }

  @Post()
  async create(
    @Body() createStrategicPlanDto: CreateStrategicPlanDto,
  ): Promise<ApiResponse<StrategicPlan>> {
    const data = await this.strategicPlansService.create(createStrategicPlanDto);
    return successResponse(
      data,
      'Plan estratégico creado exitosamente',
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStrategicPlanDto: UpdateStrategicPlanDto,
  ): Promise<ApiResponse<StrategicPlan>> {
    const data = await this.strategicPlansService.update(
      id,
      updateStrategicPlanDto,
    );
    return successResponse(
      data,
      'Plan estratégico actualizado exitosamente',
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.strategicPlansService.remove(id);
    return successResponse(
      null,
      'Plan estratégico eliminado exitosamente',
    );
  }
}

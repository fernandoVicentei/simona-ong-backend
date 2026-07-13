import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objective } from './entities/objective.entity';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { ProgramsModule } from '../programs/programs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Objective]), ProgramsModule],
  controllers: [ObjectivesController],
  providers: [ObjectivesService],
  exports: [ObjectivesService],
})
export class ObjectivesModule {}

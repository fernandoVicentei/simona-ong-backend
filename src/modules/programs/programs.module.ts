import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { StrategicPlansModule } from '../strategic-plans/strategic-plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Program]), StrategicPlansModule],
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}

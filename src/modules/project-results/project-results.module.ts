import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectResult } from './entities/project-result.entity';
import { ProjectResultsController } from './project-results.controller';
import { ProjectResultsService } from './project-results.service';
import { ProjectObjectivesModule } from '../project-objectives/project-objectives.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectResult]), ProjectObjectivesModule],
  controllers: [ProjectResultsController],
  providers: [ProjectResultsService],
  exports: [ProjectResultsService],
})
export class ProjectResultsModule {}

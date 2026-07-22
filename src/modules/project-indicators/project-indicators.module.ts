import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectIndicator } from './entities/project-indicator.entity';
import { ProjectIndicatorYearTarget } from './entities/project-indicator-year-target.entity';
import { ProjectIndicatorProgress } from './entities/project-indicator-progress.entity';
import { ProjectIndicatorAlignment } from './entities/project-indicator-alignment.entity';
import { IndicatorProgress } from '../indicators/entities/indicator-progress.entity';

import { ProjectIndicatorsController } from './project-indicators.controller';
import { ProjectIndicatorsService } from './project-indicators.service';

import { ProjectObjectivesModule } from '../project-objectives/project-objectives.module';
import { ProjectResultsModule } from '../project-results/project-results.module';
import { ProjectActivitiesModule } from '../project-activities/project-activities.module';
import { ProjectsModule } from '../projects/projects.module';
import { IndicatorsModule } from '../indicators/indicators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectIndicator,
      ProjectIndicatorYearTarget,
      ProjectIndicatorProgress,
      ProjectIndicatorAlignment,
      IndicatorProgress,
    ]),
    ProjectObjectivesModule,
    ProjectResultsModule,
    forwardRef(() => ProjectActivitiesModule),
    ProjectsModule,
    forwardRef(() => IndicatorsModule),
  ],
  controllers: [ProjectIndicatorsController],
  providers: [ProjectIndicatorsService],
  exports: [ProjectIndicatorsService],
})
export class ProjectIndicatorsModule {}

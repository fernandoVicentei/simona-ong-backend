import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectActivity } from './entities/project-activity.entity';
import { ProjectActivitiesController } from './project-activities.controller';
import { ProjectActivitiesService } from './project-activities.service';
import { ProjectResultsModule } from '../project-results/project-results.module';
import { ProjectIndicatorsModule } from '../project-indicators/project-indicators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectActivity]),
    ProjectResultsModule,
    forwardRef(() => ProjectIndicatorsModule),
  ],
  controllers: [ProjectActivitiesController],
  providers: [ProjectActivitiesService],
  exports: [ProjectActivitiesService],
})
export class ProjectActivitiesModule {}

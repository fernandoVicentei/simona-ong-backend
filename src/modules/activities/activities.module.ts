import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ResultsModule } from '../results/results.module';
import { IndicatorsModule } from '../indicators/indicators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    ResultsModule,
    forwardRef(() => IndicatorsModule),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}

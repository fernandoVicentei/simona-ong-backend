import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Indicator } from './entities/indicator.entity';
import { IndicatorYearTarget } from './entities/indicator-year-target.entity';
import { IndicatorProgress } from './entities/indicator-progress.entity';
import { IndicatorsController } from './indicators.controller';
import { IndicatorsService } from './indicators.service';
import { ObjectivesModule } from '../objectives/objectives.module';
import { ResultsModule } from '../results/results.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ProgramsModule } from '../programs/programs.module';
import { StrategicPlansModule } from '../strategic-plans/strategic-plans.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Indicator,
      IndicatorYearTarget,
      IndicatorProgress,
    ]),
    ObjectivesModule,
    ResultsModule,
    forwardRef(() => ActivitiesModule),
    ProgramsModule,
    StrategicPlansModule,
  ],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}

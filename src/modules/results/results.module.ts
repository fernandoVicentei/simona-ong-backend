import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { ObjectivesModule } from '../objectives/objectives.module';

@Module({
  imports: [TypeOrmModule.forFeature([Result]), ObjectivesModule],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService],
})
export class ResultsModule {}

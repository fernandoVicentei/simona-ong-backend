import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectObjective } from './entities/project-objective.entity';
import { ProjectObjectivesController } from './project-objectives.controller';
import { ProjectObjectivesService } from './project-objectives.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectObjective]), ProjectsModule],
  controllers: [ProjectObjectivesController],
  providers: [ProjectObjectivesService],
  exports: [ProjectObjectivesService],
})
export class ProjectObjectivesModule {}

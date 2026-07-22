import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ProjectObjective } from '../../project-objectives/entities/project-objective.entity';
import { ProjectResult } from '../../project-results/entities/project-result.entity';
import { ProjectActivity } from '../../project-activities/entities/project-activity.entity';
import { ProjectIndicatorYearTarget } from './project-indicator-year-target.entity';
import { ProjectIndicatorProgress } from './project-indicator-progress.entity';
import { ProjectIndicatorAlignment } from './project-indicator-alignment.entity';

export enum ProjectIndicatorType {
  OBJECTIVE = 'OBJECTIVE',
  RESULT = 'RESULT',
  ACTIVITY = 'ACTIVITY',
}

@Entity('project_indicators')
@Index('UQ_PROJ_INDICATOR_CODE', ['code'], { unique: true })
export class ProjectIndicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'project_objective_id',
    nullable: true,
  })
  projectObjectiveId: number | null;

  @ManyToOne(() => ProjectObjective, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_objective_id' })
  projectObjective: ProjectObjective | null;

  @Column({
    name: 'project_result_id',
    nullable: true,
  })
  projectResultId: number | null;

  @ManyToOne(() => ProjectResult, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_result_id' })
  projectResult: ProjectResult | null;

  @Column({
    name: 'project_activity_id',
    nullable: true,
  })
  projectActivityId: number | null;

  @ManyToOne(() => ProjectActivity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_activity_id' })
  projectActivity: ProjectActivity | null;

  @Column({
    type: 'enum',
    enum: ProjectIndicatorType,
  })
  type: ProjectIndicatorType;

  @Column({
    length: 30,
  })
  code: string;

  @Column({
    length: 250,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'target_value',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  targetValue: number;

  @Column({
    name: 'measurement_unit',
    length: 100,
    nullable: true,
  })
  measurementUnit: string;

  @Column({
    default: true,
  })
  active: boolean;

  @OneToMany(() => ProjectIndicatorYearTarget, (target) => target.indicator)
  yearTargets: ProjectIndicatorYearTarget[];

  @OneToMany(() => ProjectIndicatorProgress, (progress) => progress.indicator)
  progressRecords: ProjectIndicatorProgress[];

  @OneToMany(() => ProjectIndicatorAlignment, (alignment) => alignment.projectIndicator)
  alignments: ProjectIndicatorAlignment[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;
}

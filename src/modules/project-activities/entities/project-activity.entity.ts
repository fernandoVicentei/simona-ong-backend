import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ProjectResult } from '../../project-results/entities/project-result.entity';
import { ProjectIndicator } from '../../project-indicators/entities/project-indicator.entity';

@Entity('project_activities')
@Index('UQ_PROJ_ACTIVITY_CODE', ['projectResultId', 'code'], { unique: true })
export class ProjectActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'project_result_id',
  })
  projectResultId: number;

  @ManyToOne(() => ProjectResult, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'project_result_id' })
  result: ProjectResult;

  @Column({
    name: 'objective_indicator_id',
    nullable: true,
  })
  objectiveIndicatorId: number | null;

  @ManyToOne(() => ProjectIndicator, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'objective_indicator_id' })
  objectiveIndicator: ProjectIndicator | null;

  @Column({
    name: 'result_indicator_id',
    nullable: true,
  })
  resultIndicatorId: number | null;

  @ManyToOne(() => ProjectIndicator, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'result_indicator_id' })
  resultIndicator: ProjectIndicator | null;

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
    name: 'completion_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  completionPercentage: number;

  @Column({
    name: 'start_date',
    type: 'date',
    nullable: true,
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'date',
    nullable: true,
  })
  endDate: Date;

  @Column({
    default: true,
  })
  active: boolean;

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

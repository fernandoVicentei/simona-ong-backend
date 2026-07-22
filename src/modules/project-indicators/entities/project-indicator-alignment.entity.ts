import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { ProjectIndicator } from './project-indicator.entity';
import { Indicator } from '../../indicators/entities/indicator.entity';

@Entity('project_indicator_alignments')
@Unique('UQ_PROJ_INDICATOR_ALIGNMENT', ['projectIndicatorId'])
export class ProjectIndicatorAlignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'project_indicator_id',
  })
  projectIndicatorId: number;

  @ManyToOne(() => ProjectIndicator, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_indicator_id' })
  projectIndicator: ProjectIndicator;

  @Column({
    name: 'strategic_indicator_id',
  })
  strategicIndicatorId: number;

  @ManyToOne(() => Indicator, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'strategic_indicator_id' })
  strategicIndicator: Indicator;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}

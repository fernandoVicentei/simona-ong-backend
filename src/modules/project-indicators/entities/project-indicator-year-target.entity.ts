import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { ProjectIndicator } from './project-indicator.entity';

@Entity('project_indicator_year_targets')
@Unique('UQ_PROJ_INDICATOR_YEAR', ['indicatorId', 'year'])
export class ProjectIndicatorYearTarget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'indicator_id',
  })
  indicatorId: number;

  @ManyToOne(() => ProjectIndicator, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'indicator_id' })
  indicator: ProjectIndicator;

  @Column({
    type: 'smallint',
  })
  year: number;

  @Column({
    name: 'target_value',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  targetValue: number;

  @Column({
    name: 'achieved_value',
    type: 'int',
    nullable: true,
  })
  achievedValue: number | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}

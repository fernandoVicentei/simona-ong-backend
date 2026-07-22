import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { ProjectIndicator } from './project-indicator.entity';
import { User } from '../../users/entities/user.entity';

@Entity('project_indicator_progress')
@Index('IDX_PROJ_INDICATOR_PROGRESS', ['indicatorId', 'progressDate'])
export class ProjectIndicatorProgress {
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
    name: 'progress_date',
    type: 'date',
  })
  progressDate: Date;

  @Column({
    name: 'current_value',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  currentValue: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  observations: string;

  @Column({
    name: 'registered_by',
    nullable: true,
  })
  registeredBy: number | null;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'registered_by' })
  registeredUser: User | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}

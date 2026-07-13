import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { Indicator } from './indicator.entity';
import { User } from '../../users/entities/user.entity';

@Entity('indicator_progress')
@Index('IDX_INDICATOR_PROGRESS', ['indicatorId', 'progressDate'])
export class IndicatorProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'indicator_id',
  })
  indicatorId: number;

  @ManyToOne(() => Indicator, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'indicator_id',
  })
  indicator: Indicator;

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
  })
  registeredBy: number;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'registered_by',
  })
  registeredUser: User | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}

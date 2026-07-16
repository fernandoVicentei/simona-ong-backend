import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

import { Result } from '../../results/entities/result.entity';
import { Indicator } from '../../indicators/entities/indicator.entity';

@Entity('activities')
@Index('UQ_ACTIVITY_CODE_PER_RESULT', ['resultId', 'code'], {
  unique: true,
})
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'result_id',
  })
  resultId: number;

  @ManyToOne(() => Result, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'result_id',
  })
  result: Result;

  @Column({
    name: 'objective_indicator_id',
    nullable: true,
  })
  objectiveIndicatorId: number | null;

  @ManyToOne(() => Indicator, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'objective_indicator_id' })
  objectiveIndicator: Indicator | null;

  @Column({
    name: 'result_indicator_id',
    nullable: true,
  })
  resultIndicatorId: number | null;

  @ManyToOne(() => Indicator, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'result_indicator_id' })
  resultIndicator: Indicator | null;

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

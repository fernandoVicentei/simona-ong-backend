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

import { Objective } from '../../objectives/entities/objective.entity';
import { Result } from '../../results/entities/result.entity';
import { Activity } from '../../activities/entities/activity.entity';
import { IndicatorYearTarget } from './indicator-year-target.entity';
import { IndicatorProgress } from './indicator-progress.entity';

export enum IndicatorType {
  OBJECTIVE = 'OBJECTIVE',
  RESULT = 'RESULT',
  ACTIVITY = 'ACTIVITY',
}

@Entity('indicators')
@Index('UQ_INDICATOR_CODE', ['code'], {
  unique: true,
})
export class Indicator {
  @PrimaryGeneratedColumn()
  id: number;

  // ─── FK opcional a Objective ───────────────────────────────────────────────
  @Column({
    name: 'objective_id',
    nullable: true,
  })
  objectiveId: number | null;

  @ManyToOne(() => Objective, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'objective_id' })
  objective: Objective | null;

  // ─── FK opcional a Result ──────────────────────────────────────────────────
  @Column({
    name: 'result_id',
    nullable: true,
  })
  resultId: number | null;

  @ManyToOne(() => Result, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'result_id' })
  result: Result | null;

  // ─── FK opcional a Activity ────────────────────────────────────────────────
  @Column({
    name: 'activity_id',
    nullable: true,
  })
  activityId: number | null;

  @ManyToOne(() => Activity, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity | null;

  // ─── Campos propios ────────────────────────────────────────────────────────
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
    type: 'enum',
    enum: IndicatorType,
  })
  type: IndicatorType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  targetValue: number;

  @Column({
    length: 100,
    nullable: true,
  })
  measurementUnit: string;

  @Column({
    default: true,
  })
  active: boolean;

  // ─── Relaciones inversas ───────────────────────────────────────────────────
  @OneToMany(() => IndicatorYearTarget, (target) => target.indicator)
  yearTargets: IndicatorYearTarget[];

  @OneToMany(() => IndicatorProgress, (progress) => progress.indicator)
  progressRecords: IndicatorProgress[];

  // ─── Timestamps ────────────────────────────────────────────────────────────
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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

import { Activity } from '../../activities/entities/activity.entity';

import { Objective } from '../../objectives/entities/objective.entity';

@Entity('results')
@Index('UQ_RESULT_CODE_PER_OBJECTIVE', ['objectiveId', 'code'], {
  unique: true,
})
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'objective_id',
  })
  objectiveId: number;

  @ManyToOne(() => Objective, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'objective_id',
  })
  objective: Objective;

  @OneToMany(() => Activity, (activity) => activity.result)
  activities: Activity[];

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

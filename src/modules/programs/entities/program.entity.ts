import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

import { StrategicPlan } from '../../strategic-plans/entities/strategic-plan.entity';
import { Objective } from '../../objectives/entities/objective.entity';

@Entity('programs')
@Index('UQ_PROGRAM_CODE_PER_PLAN', ['strategicPlanId', 'code'], {
  unique: true,
})
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'strategic_plan_id',
  })
  strategicPlanId: number;

  @ManyToOne(() => StrategicPlan, (strategicPlan) => strategicPlan.programs, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'strategic_plan_id',
  })
  strategicPlan: StrategicPlan;

  @OneToMany('Objective', 'program')
  objectives: Objective[];

  @Column({
    length: 30,
  })
  code: string;

  @Column({
    length: 200,
  })
  name: string;

  @Column({
    name: 'general_objective',
    type: 'text',
  })
  generalObjective: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

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

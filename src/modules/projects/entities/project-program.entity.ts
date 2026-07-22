import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Project } from './project.entity';
import { Program } from '../../programs/entities/program.entity';
import { StrategicPlan } from '../../strategic-plans/entities/strategic-plan.entity';

@Entity('project_programs')
export class ProjectProgram {
  @PrimaryColumn({
    name: 'project_id',
  })
  projectId: number;

  @PrimaryColumn({
    name: 'program_id',
  })
  programId: number;

  @Column({
    name: 'strategic_plan_id',
    nullable: true,
  })
  strategicPlanId: number;

  @ManyToOne(() => Project, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Program, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => StrategicPlan, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'strategic_plan_id' })
  strategicPlan: StrategicPlan;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}

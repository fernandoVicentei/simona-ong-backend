import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ProjectObjective } from '../../project-objectives/entities/project-objective.entity';
import { ProjectActivity } from '../../project-activities/entities/project-activity.entity';
import { ProjectIndicator } from '../../project-indicators/entities/project-indicator.entity';

@Entity('project_results')
@Index('UQ_PROJ_RESULT_OBJECTIVE', ['projectObjectiveId'], { unique: true })
@Index('UQ_PROJ_RESULT_CODE', ['projectObjectiveId', 'code'], { unique: true })
export class ProjectResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'project_objective_id',
  })
  projectObjectiveId: number;

  @OneToOne(() => ProjectObjective, (po) => po.result, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_objective_id' })
  objective: ProjectObjective;

  @OneToMany(() => ProjectActivity, (pa) => pa.result)
  activities: ProjectActivity[];

  @OneToMany(() => ProjectIndicator, (pi) => pi.projectResult)
  indicators: ProjectIndicator[];

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

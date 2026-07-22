import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Project } from '../../projects/entities/project.entity';
import { ProjectResult } from '../../project-results/entities/project-result.entity';
import { ProjectIndicator } from '../../project-indicators/entities/project-indicator.entity';

@Entity('project_objectives')
@Index('UQ_PROJ_OBJECTIVE_CODE', ['projectId', 'code'], { unique: true })
export class ProjectObjective {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'project_id',
  })
  projectId: number;

  @ManyToOne(() => Project, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToOne(() => ProjectResult, (pr) => pr.objective)
  result: ProjectResult;

  @OneToMany(() => ProjectIndicator, (pi) => pi.projectObjective)
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

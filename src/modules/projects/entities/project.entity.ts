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

import { Organization } from '../../organizations/entities/organization.entity';
import { ProjectProgram } from './project-program.entity';
import { ProjectObjective } from '../../project-objectives/entities/project-objective.entity';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

@Entity('projects')
@Index('UQ_PROJECT_CODE', ['code'], { unique: true })
@Index('UQ_PROJECT_ORG_PERIOD', ['organizationId', 'code'], { unique: true })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'organization_id',
  })
  organizationId: number;

  @ManyToOne(() => Organization, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({
    length: 30,
  })
  code: string;

  @Column({
    length: 200,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'start_date',
    type: 'date',
  })
  startDate: Date;

  @Column({
    name: 'end_date',
    type: 'date',
  })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column({
    default: true,
  })
  active: boolean;

  @OneToMany(() => ProjectProgram, (pp) => pp.project)
  projectPrograms: ProjectProgram[];

  @OneToMany(() => ProjectObjective, (po) => po.project)
  objectives: ProjectObjective[];

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

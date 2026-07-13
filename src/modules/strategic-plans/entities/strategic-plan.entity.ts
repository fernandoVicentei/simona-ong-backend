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

import { Program } from '../../programs/entities/program.entity';

import { Organization } from '../../organizations/entities/organization.entity';

@Entity('strategic_plans')
@Index('UQ_STRATEGIC_PLAN_PERIOD', ['organizationId', 'startYear', 'endYear'], {
  unique: true,
})
export class StrategicPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'organization_id',
  })
  organizationId: number;

  @ManyToOne(() => Organization, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'organization_id',
  })
  organization: Organization;

  @OneToMany(() => Program, (program) => program.strategicPlan)
  programs: Program[];

  @Column({
    length: 30,
    unique: true,
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
    name: 'start_year',
    type: 'smallint',
  })
  startYear: number;

  @Column({
    name: 'end_year',
    type: 'smallint',
  })
  endYear: number;

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

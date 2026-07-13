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

import { Result } from '../../results/entities/result.entity';
import { Program } from '../../programs/entities/program.entity';

@Entity('objectives')
@Index('UQ_OBJECTIVE_CODE_PER_PROGRAM', ['programId', 'code'], {
  unique: true,
})
export class Objective {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'program_id',
  })
  programId: number;

  @ManyToOne('Program', 'objectives', {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'program_id',
  })
  program: Program;

  @OneToMany(() => Result, (result) => result.objective)
  results: Result[];

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

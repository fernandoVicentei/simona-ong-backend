import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    length: 100,
  })
  module: string;

  @Column({
    length: 50,
  })
  action: string;

  @Column({
    nullable: true,
  })
  recordId: number;

  @Column({
    nullable: true,
    length: 50,
  })
  ip: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

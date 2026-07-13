import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 100,
  })
  code: string;

  @Column({
    length: 150,
  })
  name: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

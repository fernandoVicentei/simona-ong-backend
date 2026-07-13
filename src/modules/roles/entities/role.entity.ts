import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 50,
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

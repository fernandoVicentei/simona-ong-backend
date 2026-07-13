import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrganizationUser } from '../../organizations/entities/organization-user.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100, nullable: true })
  lastName: string;

  @Column({
    unique: true,
    length: 150,
    nullable: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    length: 30,
  })
  phone: string;

  @Column({
    nullable: true,
    length: 100,
  })
  position: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
  )
  organizationUsers: OrganizationUser[];
}

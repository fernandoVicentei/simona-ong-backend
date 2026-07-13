import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrganizationUser } from './organization-user.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 200,
  })
  name: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.organization,
  )
  organizationUsers: OrganizationUser[];
}

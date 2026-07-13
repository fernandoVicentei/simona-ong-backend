import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../../users/entities/user.entity';

@Entity('organization_users')
export class OrganizationUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, (org) => org.organizationUsers)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User, (user) => user.organizationUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

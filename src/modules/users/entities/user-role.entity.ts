import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { User } from './user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
  })
  role: Role;
}

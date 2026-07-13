import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Role } from './role.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
  })
  role: Role;

  @ManyToOne(() => Permission)
  @JoinColumn({
    name: 'permission_id',
  })
  permission: Permission;
}

import { DataSource } from 'typeorm';
import { Permission } from '../../modules/permissions/entities/permission.entity';

export async function permissionSeeder(dataSource: DataSource) {
  const repository = dataSource.getRepository(Permission);

  const permissions = [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',

    'roles.view',
    'roles.create',
    'roles.edit',
    'roles.delete',

    'permissions.view',

    'audit.view',

    'organizations.view',
    'organizations.create',
    'organizations.edit',
    'organizations.delete',
  ];

  for (const code of permissions) {
    const exists = await repository.findOne({
      where: { code },
    });

    if (!exists) {
      await repository.save({
        code,
        name: code,
      });
    }
  }
}

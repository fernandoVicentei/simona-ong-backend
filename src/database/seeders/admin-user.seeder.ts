import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../modules/users/entities/user.entity';

export async function adminUserSeeder(dataSource: DataSource) {
  const repository = dataSource.getRepository(User);

  const email = 'admin@system.local';

  const exists = await repository.findOne({
    where: {
      email,
    },
  });

  if (exists) {
    return;
  }

  const password = await bcrypt.hash('Admin123*', 10);

  await repository.save({
    firstName: 'Administrador',
    lastName: 'Sistema',
    email,
    password,
    isActive: true,
  });
}

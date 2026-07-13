import AppDataSource from '../../config/data-source';

import { roleSeeder } from './role.seeder';
import { permissionSeeder } from './permission.seeder';
import { adminUserSeeder } from './admin-user.seeder';

async function runSeeders() {
  await AppDataSource.initialize();

  try {
    await roleSeeder(AppDataSource);

    await permissionSeeder(AppDataSource);

    await adminUserSeeder(AppDataSource);

    console.log('Seeders ejecutados correctamente');
  } catch (error) {
    console.error(error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeders();

import 'dotenv/config';

import dataSource from '../../config/data-source';
import { projectsSeeder } from './projects';
import { Organization } from '../../modules/organizations/entities/organization.entity';

async function runSeeders(): Promise<void> {
  try {
    await dataSource.initialize();

    console.log('=======================================');
    console.log('🌱 Iniciando ejecución de Seeders de Proyectos...');
    console.log('=======================================');

    const orgRepository = dataSource.getRepository(Organization);
    const orgCount = await orgRepository.count();
    if (orgCount === 0) {
      console.log('🏢 Creando Organización por defecto...');
      await orgRepository.save({
        name: 'Organización Principal',
        description: 'Organización principal creada automáticamente para los proyectos.',
      });
      console.log('🏢 Organización por defecto creada.');
    }

    await projectsSeeder(dataSource);

    console.log('=======================================');
    console.log('✅ Seeders de Proyectos ejecutados correctamente.');
    console.log('=======================================');
  } catch (error) {
    console.error('❌ Error ejecutando los seeders de Proyectos');
    console.error(error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeeders();

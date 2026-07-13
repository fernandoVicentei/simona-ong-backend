import 'dotenv/config';

import dataSource from '../../config/data-source';
import { planningSeeder } from './strategic_plans';
import { Organization } from '../../modules/organizations/entities/organization.entity';

async function runSeeders(): Promise<void> {
  try {
    await dataSource.initialize();

    console.log('=======================================');
    console.log('🌱 Iniciando ejecución de Seeders...');
    console.log('=======================================');

    const orgRepository = dataSource.getRepository(Organization);
    const orgCount = await orgRepository.count();
    if (orgCount === 0) {
      console.log('🏢 Creando Organización por defecto...');
      await orgRepository.save({
        name: 'Organización Principal',
        description: 'Organización principal creada automáticamente para la planificación estratégica.',
      });
      console.log('🏢 Organización por defecto creada.');
    }

    await planningSeeder(dataSource);

    console.log('=======================================');
    console.log('✅ Seeders ejecutados correctamente.');
    console.log('=======================================');
  } catch (error) {
    console.error('❌ Error ejecutando los seeders');
    console.error(error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeeders();
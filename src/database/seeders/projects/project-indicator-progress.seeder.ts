import { EntityManager } from 'typeorm';

import { ProjectIndicator } from '../../../modules/project-indicators/entities/project-indicator.entity';
import { ProjectIndicatorProgress } from '../../../modules/project-indicators/entities/project-indicator-progress.entity';
import { User } from '../../../modules/users/entities/user.entity';

export async function projectIndicatorProgressSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Indicator Progress...');

  const total = await manager.count(ProjectIndicatorProgress);

  if (total > 0) {
    console.log('⏭️ Project Indicator Progress ya fue poblado.');
    return;
  }

  const indicators = await manager.find(ProjectIndicator, {
    order: { id: 'ASC' },
  });

  if (indicators.length === 0) {
    throw new Error(
      'No existen Indicadores de Proyecto registrados. Ejecute primero projectIndicatorSeeder.',
    );
  }

  const registeredUser = await manager.findOne(User, {
    where: {},
    order: { id: 'ASC' },
  });

  if (!registeredUser) {
    throw new Error(
      'No existe ningún usuario registrado. Debe ejecutar primero el seeder de usuarios.',
    );
  }

  const progressRecords: Partial<ProjectIndicatorProgress>[] = [];

  const progressTemplate = [
    {
      progressDate: new Date('2025-03-15'),
      currentValue: 10,
      observations: 'Primer avance registrado del indicador.',
    },
    {
      progressDate: new Date('2025-06-15'),
      currentValue: 25,
      observations: 'Avance correspondiente al segundo trimestre.',
    },
    {
      progressDate: new Date('2025-09-15'),
      currentValue: 35,
      observations: 'Avance del tercer trimestre.',
    },
    {
      progressDate: new Date('2025-12-15'),
      currentValue: 20,
      observations: 'Cierre anual del indicador.',
    },
  ];

  for (const indicator of indicators) {
    for (const progress of progressTemplate) {
      progressRecords.push({
        indicatorId: indicator.id,
        progressDate: progress.progressDate,
        currentValue: progress.currentValue,
        observations: progress.observations,
        registeredBy: registeredUser.id,
      });
    }
  }

  const entities = manager.create(
    ProjectIndicatorProgress,
    progressRecords,
  );

  await manager.save(entities);

  console.log(`✅ ${entities.length} registros de avance de Proyecto creados.`);
}

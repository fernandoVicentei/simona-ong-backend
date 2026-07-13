import { EntityManager } from 'typeorm';

import { Indicator } from '../../../modules/indicators/entities/indicator.entity';
import { IndicatorProgress } from '../../../modules/indicators/entities/indicator-progress.entity';
import { User } from '../../../modules/users/entities/user.entity';

export async function indicatorProgressSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Indicator Progress...');

  const total = await manager.count(IndicatorProgress);

  if (total > 0) {
    console.log('⏭️ Indicator Progress ya fue poblado.');
    return;
  }

  const indicators = await manager.find(Indicator, {
    order: {
      id: 'ASC',
    },
  });

  if (indicators.length === 0) {
    throw new Error(
      'No existen Indicadores registrados. Ejecute primero indicatorSeeder.',
    );
  }

  const registeredUser = await manager.findOne(User, {
    where: {},
    order: {
      id: 'ASC',
    },
  });

  if (!registeredUser) {
    throw new Error(
      'No existe ningún usuario registrado. Debe ejecutar primero el seeder de usuarios.',
    );
  }

  const progressRecords: Partial<IndicatorProgress>[] = [];

  const progressTemplate = [
    {
      progressDate: new Date('2025-02-15'),
      currentValue: 20,
      observations: 'Primer avance registrado.',
    },
    {
      progressDate: new Date('2025-04-15'),
      currentValue: 35,
      observations: 'Segundo seguimiento realizado.',
    },
    {
      progressDate: new Date('2025-06-15'),
      currentValue: 40,
      observations: 'Seguimiento correspondiente al segundo trimestre.',
    },
    {
      progressDate: new Date('2025-09-15'),
      currentValue: 30,
      observations: 'Avance del tercer trimestre.',
    },
    {
      progressDate: new Date('2025-12-15'),
      currentValue: 25,
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
    IndicatorProgress,
    progressRecords,
  );

  await manager.save(entities);

  console.log(`✅ ${entities.length} registros de avance creados.`);
}
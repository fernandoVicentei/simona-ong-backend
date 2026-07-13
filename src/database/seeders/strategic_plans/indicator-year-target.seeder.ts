import { EntityManager } from 'typeorm';

import { Indicator } from '../../../modules/indicators/entities/indicator.entity';
import { IndicatorYearTarget } from '../../../modules/indicators/entities/indicator-year-target.entity';

export async function indicatorYearTargetSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Indicator Year Targets...');

  const total = await manager.count(IndicatorYearTarget);

  if (total > 0) {
    console.log('⏭️ Indicator Year Targets ya fueron poblados.');
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

  const yearTargets: Partial<IndicatorYearTarget>[] = [];

  const years = [2025, 2026, 2027, 2028, 2029];

  for (const indicator of indicators) {
    const target = Number(indicator.targetValue);
    const annualTarget = Number((target / years.length).toFixed(2));

    years.forEach((year) => {
      yearTargets.push({
        indicatorId: indicator.id,
        year,
        targetValue: annualTarget,
      });
    });
  }

  const entities = manager.create(IndicatorYearTarget, yearTargets);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Metas anuales creadas.`);
}
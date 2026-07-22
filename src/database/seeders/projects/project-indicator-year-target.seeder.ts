import { EntityManager } from 'typeorm';

import { ProjectIndicator } from '../../../modules/project-indicators/entities/project-indicator.entity';
import { ProjectIndicatorYearTarget } from '../../../modules/project-indicators/entities/project-indicator-year-target.entity';
import { Project } from '../../../modules/projects/entities/project.entity';
import { ProjectObjective } from '../../../modules/project-objectives/entities/project-objective.entity';
import { ProjectResult } from '../../../modules/project-results/entities/project-result.entity';
import { ProjectActivity } from '../../../modules/project-activities/entities/project-activity.entity';

export async function projectIndicatorYearTargetSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Indicator Year Targets...');

  const total = await manager.count(ProjectIndicatorYearTarget);

  if (total > 0) {
    console.log('⏭️ Project Indicator Year Targets ya fueron poblados.');
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

  const yearTargets: Partial<ProjectIndicatorYearTarget>[] = [];

  const yearsByIndicator: Record<number, number[]> = {
    1: [2025, 2026, 2027],
    2: [2025, 2026, 2027],
    3: [2025, 2026, 2027],
    4: [2025, 2026, 2027],
    5: [2025, 2026, 2027],
    6: [2025, 2026],
  };

  for (const indicator of indicators) {
    const years = yearsByIndicator[indicator.id] || [2025, 2026, 2027];
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

  const entities = manager.create(ProjectIndicatorYearTarget, yearTargets);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Metas anuales de Proyecto creadas.`);
}

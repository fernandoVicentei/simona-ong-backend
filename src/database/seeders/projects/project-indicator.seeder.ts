import { EntityManager } from 'typeorm';

import {
  ProjectIndicator,
  ProjectIndicatorType,
} from '../../../modules/project-indicators/entities/project-indicator.entity';
import { ProjectObjective } from '../../../modules/project-objectives/entities/project-objective.entity';
import { ProjectResult } from '../../../modules/project-results/entities/project-result.entity';
import { ProjectActivity } from '../../../modules/project-activities/entities/project-activity.entity';

export async function projectIndicatorSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Indicators...');

  const total = await manager.count(ProjectIndicator);

  if (total > 0) {
    console.log('⏭️ Project Indicators ya fueron poblados.');
    return;
  }

  const objectives = await manager.find(ProjectObjective, {
    order: { id: 'ASC' },
  });

  const results = await manager.find(ProjectResult, {
    order: { id: 'ASC' },
  });

  const activities = await manager.find(ProjectActivity, {
    order: { id: 'ASC' },
  });

  if (
    objectives.length === 0 ||
    results.length === 0 ||
    activities.length === 0
  ) {
    throw new Error(
      'No existen Objetivos, Resultados o Actividades de Proyecto registrados.',
    );
  }

  const indicators = manager.create(ProjectIndicator, [
    {
      projectObjectiveId: objectives[0].id,
      code: 'PIND-001',
      name: 'Sistemas de captación de agua instalados',
      description:
        'Número de sistemas de captación de agua de lluvia instalados y operativos.',
      type: ProjectIndicatorType.OBJECTIVE,
      targetValue: 5,
      measurementUnit: 'Sistemas',
      active: true,
    },
    {
      projectResultId: results[1].id,
      code: 'PIND-002',
      name: 'Familias capacitadas en higiene y saneamiento',
      description:
        'Número de familias que completaron el programa de capacitación en higiene y saneamiento.',
      type: ProjectIndicatorType.RESULT,
      targetValue: 500,
      measurementUnit: 'Familias',
      active: true,
    },
    {
      projectActivityId: activities[4].id,
      code: 'PIND-003',
      name: 'Huertos familiares instalados y en producción',
      description:
        'Número de huertos familiares instalados que se mantienen en producción continua.',
      type: ProjectIndicatorType.ACTIVITY,
      targetValue: 200,
      measurementUnit: 'Huertos',
      active: true,
    },
    {
      projectActivityId: activities[5].id,
      code: 'PIND-004',
      name: 'Productores capacitados en técnicas agroecológicas',
      description:
        'Número de productores que completaron el programa de capacitación en producción orgánica.',
      type: ProjectIndicatorType.ACTIVITY,
      targetValue: 200,
      measurementUnit: 'Productores',
      active: true,
    },
    {
      projectObjectiveId: objectives[3].id,
      code: 'PIND-005',
      name: 'Familias con mejora en diversidad alimenticia',
      description:
        'Número de familias que incorporan al menos 3 tipos de hortalizas del huerto en su dieta semanal.',
      type: ProjectIndicatorType.OBJECTIVE,
      targetValue: 180,
      measurementUnit: 'Familias',
      active: true,
    },
    {
      projectResultId: results[4].id,
      code: 'PIND-006',
      name: 'Jóvenes con planes de negocio formulados',
      description:
        'Número de jóvenes que completan la formulación de su plan de negocio.',
      type: ProjectIndicatorType.RESULT,
      targetValue: 60,
      measurementUnit: 'Jóvenes',
      active: true,
    },
  ]);

  await manager.save(indicators);

  console.log(`✅ ${indicators.length} Indicadores de Proyecto creados.`);
}

import { EntityManager } from 'typeorm';

import {
  Indicator,
  IndicatorType,
} from '../../../modules/indicators/entities/indicator.entity';

import { Objective } from '../../../modules/objectives/entities/objective.entity';
import { Result } from '../../../modules/results/entities/result.entity';
import { Activity } from '../../../modules/activities/entities/activity.entity';

export async function indicatorSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Indicators...');

  const total = await manager.count(Indicator);

  if (total > 0) {
    console.log('⏭️ Indicators ya fueron poblados.');
    return;
  }

  const objectives = await manager.find(Objective, {
    order: {
      id: 'ASC',
    },
  });

  const results = await manager.find(Result, {
    order: {
      id: 'ASC',
    },
  });

  const activities = await manager.find(Activity, {
    order: {
      id: 'ASC',
    },
  });

  if (
    objectives.length === 0 ||
    results.length === 0 ||
    activities.length === 0
  ) {
    throw new Error(
      'No existen Objetivos, Resultados o Actividades registrados.',
    );
  }

  const indicators: Partial<Indicator>[] = [
    {
      objectiveId: objectives[0].id,
      code: 'IND-001',
      name: 'Personas beneficiadas con campañas de salud',
      description:
        'Cantidad de personas que participaron en campañas de prevención.',
      type: IndicatorType.OBJECTIVE,
      targetValue: 500,
      measurementUnit: 'Personas',
      active: true,
    },
    {
      resultId: results[1].id,
      code: 'IND-002',
      name: 'Estudiantes con permanencia escolar',
      description:
        'Número de estudiantes que permanecen matriculados durante la gestión.',
      type: IndicatorType.RESULT,
      targetValue: 350,
      measurementUnit: 'Estudiantes',
      active: true,
    },
    {
      activityId: activities[2].id,
      code: 'IND-003',
      name: 'Visitas domiciliarias realizadas',
      description:
        'Cantidad de visitas efectuadas a familias beneficiarias.',
      type: IndicatorType.ACTIVITY,
      targetValue: 240,
      measurementUnit: 'Visitas',
      active: true,
    },
    {
      activityId: activities[3].id,
      code: 'IND-004',
      name: 'Productores capacitados',
      description:
        'Número de productores que concluyeron el proceso de capacitación.',
      type: IndicatorType.ACTIVITY,
      targetValue: 180,
      measurementUnit: 'Productores',
      active: true,
    },
    {
      resultId: results[4].id,
      code: 'IND-005',
      name: 'Emprendimientos fortalecidos',
      description:
        'Cantidad de emprendimientos que recibieron asistencia técnica.',
      type: IndicatorType.RESULT,
      targetValue: 100,
      measurementUnit: 'Emprendimientos',
      active: true,
    },
  ];

  const entities = manager.create(Indicator, indicators);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Indicadores creados.`);
}
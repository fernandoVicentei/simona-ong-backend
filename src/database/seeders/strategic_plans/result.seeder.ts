import { EntityManager } from 'typeorm';

import { Result } from '../../../modules/results/entities/result.entity';
import { Objective } from '../../../modules/objectives/entities/objective.entity';

export async function resultSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Results...');

  const total = await manager.count(Result);

  if (total > 0) {
    console.log('⏭️ Results ya fueron poblados.');
    return;
  }

  const objectives = await manager.find(Objective, {
    order: {
      id: 'ASC',
    },
  });

  if (objectives.length === 0) {
    throw new Error(
      'No existen Objetivos registrados. Ejecute primero objectiveSeeder.',
    );
  }

  const results: Partial<Result>[] = [
    {
      objectiveId: objectives[0].id,
      code: 'RES-001',
      name: 'Cobertura de campañas preventivas incrementada',
      description:
        'La población objetivo participa en campañas de prevención y promoción de la salud.',
      active: true,
    },
    {
      objectiveId: objectives[1].id,
      code: 'RES-002',
      name: 'Incremento en la permanencia escolar',
      description:
        'Se reduce el índice de abandono escolar mediante acciones de acompañamiento.',
      active: true,
    },
    {
      objectiveId: objectives[2].id,
      code: 'RES-003',
      name: 'Familias con mayor acceso a programas de protección',
      description:
        'Las familias vulnerables reciben atención y seguimiento oportuno.',
      active: true,
    },
    {
      objectiveId: objectives[3].id,
      code: 'RES-004',
      name: 'Mayor disponibilidad de alimentos nutritivos',
      description:
        'Las comunidades fortalecen sus capacidades para la producción y consumo de alimentos.',
      active: true,
    },
    {
      objectiveId: objectives[4].id,
      code: 'RES-005',
      name: 'Emprendimientos comunitarios fortalecidos',
      description:
        'Los beneficiarios desarrollan iniciativas económicas sostenibles.',
      active: true,
    },
  ];

  const entities = manager.create(Result, results);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Resultados creados.`);
}
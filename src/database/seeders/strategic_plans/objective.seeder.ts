import { EntityManager } from 'typeorm';

import { Objective } from '../../../modules/objectives/entities/objective.entity';
import { Program } from '../../../modules/programs/entities/program.entity';

export async function objectiveSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Objectives...');

  const total = await manager.count(Objective);

  if (total > 0) {
    console.log('⏭️ Objectives ya fueron poblados.');
    return;
  }

  const programs = await manager.find(Program, {
    order: {
      id: 'ASC',
    },
  });

  if (programs.length === 0) {
    throw new Error(
      'No existen Programas registrados. Ejecute primero programSeeder.',
    );
  }

  const objectives: Partial<Objective>[] = [
    {
      programId: programs[0].id,
      code: 'OBJ-001',
      name: 'Reducir la incidencia de enfermedades prevenibles',
      description:
        'Implementar acciones preventivas y campañas de promoción de la salud en comunidades priorizadas.',
      active: true,
    },
    {
      programId: programs[1].id,
      code: 'OBJ-002',
      name: 'Incrementar la permanencia escolar',
      description:
        'Fortalecer mecanismos de apoyo para reducir la deserción escolar.',
      active: true,
    },
    {
      programId: programs[2].id,
      code: 'OBJ-003',
      name: 'Fortalecer la protección de familias vulnerables',
      description:
        'Implementar acciones de prevención y atención integral para familias en riesgo social.',
      active: true,
    },
    {
      programId: programs[3].id,
      code: 'OBJ-004',
      name: 'Mejorar la seguridad alimentaria',
      description:
        'Promover prácticas sostenibles de producción y acceso a alimentos nutritivos.',
      active: true,
    },
    {
      programId: programs[4].id,
      code: 'OBJ-005',
      name: 'Impulsar el desarrollo económico local',
      description:
        'Fomentar iniciativas productivas y el fortalecimiento de emprendimientos comunitarios.',
      active: true,
    },
  ];

  const entities = manager.create(Objective, objectives);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Objetivos creados.`);
}
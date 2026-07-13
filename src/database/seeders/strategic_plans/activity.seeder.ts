import { EntityManager } from 'typeorm';

import { Activity } from '../../../modules/activities/entities/activity.entity';
import { Result } from '../../../modules/results/entities/result.entity';

export async function activitySeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Activities...');

  const total = await manager.count(Activity);

  if (total > 0) {
    console.log('⏭️ Activities ya fueron pobladas.');
    return;
  }

  const results = await manager.find(Result, {
    order: {
      id: 'ASC',
    },
  });

  if (results.length === 0) {
    throw new Error(
      'No existen Resultados registrados. Ejecute primero resultSeeder.',
    );
  }

  const activities: Partial<Activity>[] = [
    {
      resultId: results[0].id,
      code: 'ACT-001',
      name: 'Realizar campañas médicas comunitarias',
      description:
        'Organizar brigadas médicas para la atención preventiva en comunidades priorizadas.',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-11-30'),
      active: true,
    },
    {
      resultId: results[1].id,
      code: 'ACT-002',
      name: 'Implementar programa de apoyo escolar',
      description:
        'Desarrollar actividades de reforzamiento educativo y seguimiento académico.',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-11-30'),
      active: true,
    },
    {
      resultId: results[2].id,
      code: 'ACT-003',
      name: 'Visitas domiciliarias a familias vulnerables',
      description:
        'Realizar seguimiento social mediante visitas periódicas a las familias beneficiarias.',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-12-15'),
      active: true,
    },
    {
      resultId: results[3].id,
      code: 'ACT-004',
      name: 'Capacitaciones sobre producción alimentaria',
      description:
        'Desarrollar talleres para fortalecer la producción agrícola y seguridad alimentaria.',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-10-31'),
      active: true,
    },
    {
      resultId: results[4].id,
      code: 'ACT-005',
      name: 'Asistencia técnica para emprendimientos',
      description:
        'Brindar asesoramiento técnico y administrativo a emprendedores comunitarios.',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-12-10'),
      active: true,
    },
  ];

  const entities = manager.create(Activity, activities);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Actividades creadas.`);
}
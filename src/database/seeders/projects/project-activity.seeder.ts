import { EntityManager } from 'typeorm';

import { ProjectActivity } from '../../../modules/project-activities/entities/project-activity.entity';
import { ProjectResult } from '../../../modules/project-results/entities/project-result.entity';

export async function projectActivitySeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Activities...');

  const total = await manager.count(ProjectActivity);

  if (total > 0) {
    console.log('⏭️ Project Activities ya fueron pobladas.');
    return;
  }

  const results = await manager.find(ProjectResult, {
    order: { id: 'ASC' },
  });

  if (results.length === 0) {
    throw new Error(
      'No existen Resultados de Proyecto registrados. Ejecute primero projectResultSeeder.',
    );
  }

  const activities = manager.create(ProjectActivity, [
    {
      projectResultId: results[0].id,
      code: 'PACT-001',
      name: 'Instalación de sistemas de captación de agua de lluvia',
      description:
        'Construir e instalar sistemas de captación de agua de lluvia con tanques de almacenamiento en 5 comunidades.',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2026-06-30'),
      active: true,
    },
    {
      projectResultId: results[0].id,
      code: 'PACT-002',
      name: 'Instalación de filtros purificadores comunitarios',
      description:
        'Instalar filtros de purificación de agua en puntos estratégicos de cada comunidad beneficiaria.',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-09-30'),
      active: true,
    },
    {
      projectResultId: results[1].id,
      code: 'PACT-003',
      name: 'Talleres de lavado de manos y manejo seguro del agua',
      description:
        'Realizar talleres participativos sobre técnicas correctas de lavado de manos y almacenamiento seguro del agua.',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2027-06-30'),
      active: true,
    },
    {
      projectResultId: results[1].id,
      code: 'PACT-004',
      name: 'Formación de promotores comunitarios de saneamiento',
      description:
        'Capacitar a líderes comunitarios como promotores de saneamiento básico e higiene.',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2026-12-31'),
      active: true,
    },
    {
      projectResultId: results[2].id,
      code: 'PACT-005',
      name: 'Instalación de huertos familiares demostrativos',
      description:
        'Establecer huertos modelo en 200 hogares con sistemas de riego por goteo y semillas mejoradas.',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-10-31'),
      active: true,
    },
    {
      projectResultId: results[2].id,
      code: 'PACT-006',
      name: 'Talleres de producción agroecológica y compostaje',
      description:
        'Capacitar a las familias en técnicas de producción orgánica, control natural de plagas y elaboración de compost.',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2026-12-31'),
      active: true,
    },
    {
      projectResultId: results[3].id,
      code: 'PACT-007',
      name: 'Sesiones educativas en nutrición y alimentación saludable',
      description:
        'Realizar talleres demostrativos de cocina saludable aprovechando los productos del huerto.',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2027-01-31'),
      active: true,
    },
    {
      projectResultId: results[3].id,
      code: 'PACT-008',
      name: 'Ferias de intercambio de semillas y productos',
      description:
        'Organizar ferias comunitarias para intercambio de semillas criollas y productos del huerto.',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-12-31'),
      active: true,
    },
    {
      projectResultId: results[4].id,
      code: 'PACT-009',
      name: 'Talleres de formulación de planes de negocio',
      description:
        'Capacitar a jóvenes en elaboración de planes de negocio, estudio de mercado y proyecciones financieras.',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2026-06-30'),
      active: true,
    },
    {
      projectResultId: results[4].id,
      code: 'PACT-010',
      name: 'Feria de emprendimientos juveniles',
      description:
        'Organizar una feria donde los jóvenes presenten sus emprendimientos y accedan a financiamiento inicial.',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-11-30'),
      active: true,
    },
  ]);

  await manager.save(activities);

  console.log(`✅ ${activities.length} Actividades de Proyecto creadas.`);
}

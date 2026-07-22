import { EntityManager } from 'typeorm';

import { ProjectResult } from '../../../modules/project-results/entities/project-result.entity';
import { ProjectObjective } from '../../../modules/project-objectives/entities/project-objective.entity';

export async function projectResultSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Results...');

  const total = await manager.count(ProjectResult);

  if (total > 0) {
    console.log('⏭️ Project Results ya fueron poblados.');
    return;
  }

  const objectives = await manager.find(ProjectObjective, {
    order: { id: 'ASC' },
  });

  if (objectives.length === 0) {
    throw new Error(
      'No existen Objetivos de Proyecto registrados. Ejecute primero projectObjectiveSeeder.',
    );
  }

  const results = manager.create(ProjectResult, [
    {
      projectObjectiveId: objectives[0].id,
      code: 'PRES-001',
      name: 'Sistemas de captación y purificación de agua instalados',
      description:
        'Las 5 comunidades cuentan con sistemas de captación de agua de lluvia y filtros purificadores funcionando.',
      active: true,
    },
    {
      projectObjectiveId: objectives[1].id,
      code: 'PRES-002',
      name: 'Familias capacitadas en higiene y saneamiento básico',
      description:
        'Las familias beneficiarias adoptan prácticas correctas de lavado de manos, manejo seguro del agua y saneamiento.',
      active: true,
    },
    {
      projectObjectiveId: objectives[2].id,
      code: 'PRES-003',
      name: 'Huertos familiares produciendo alimentos frescos',
      description:
        'Los 200 hogares cuentan con huertos en producción continua de verduras y hortalizas.',
      active: true,
    },
    {
      projectObjectiveId: objectives[3].id,
      code: 'PRES-004',
      name: 'Familias con hábitos alimenticios mejorados',
      description:
        'Las familias incorporan los productos del huerto en su dieta diaria y diversifican su alimentación.',
      active: true,
    },
    {
      projectObjectiveId: objectives[4].id,
      code: 'PRES-005',
      name: 'Jóvenes con planes de negocio desarrollados',
      description:
        'Los participantes completan la formación y elaboran planes de negocio viables para sus emprendimientos.',
      active: true,
    },
  ]);

  await manager.save(results);

  console.log(`✅ ${results.length} Resultados de Proyecto creados.`);
}

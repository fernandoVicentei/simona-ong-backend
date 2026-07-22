import { EntityManager } from 'typeorm';

import { ProjectObjective } from '../../../modules/project-objectives/entities/project-objective.entity';
import { Project } from '../../../modules/projects/entities/project.entity';

export async function projectObjectiveSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Objectives...');

  const total = await manager.count(ProjectObjective);

  if (total > 0) {
    console.log('⏭️ Project Objectives ya fueron poblados.');
    return;
  }

  const projects = await manager.find(Project, {
    order: { id: 'ASC' },
  });

  if (projects.length === 0) {
    throw new Error(
      'No existen Proyectos registrados. Ejecute primero projectSeeder.',
    );
  }

  const objectives = manager.create(ProjectObjective, [
    {
      projectId: projects[0].id,
      code: 'POBJ-001',
      name: 'Garantizar el acceso a agua potable en 5 comunidades rurales',
      description:
        'Implementar sistemas de captación, almacenamiento y purificación de agua para beneficiar a 5 comunidades sin acceso al servicio.',
      active: true,
    },
    {
      projectId: projects[0].id,
      code: 'POBJ-002',
      name: 'Promover prácticas de higiene y saneamiento básico',
      description:
        'Capacitar a las familias en manejo seguro del agua, lavado de manos y saneamiento básico.',
      active: true,
    },
    {
      projectId: projects[1].id,
      code: 'POBJ-003',
      name: 'Implementar huertos familiares en 200 hogares',
      description:
        'Establecer huertos familiares con técnicas agroecológicas y sistemas de riego por goteo en 200 hogares.',
      active: true,
    },
    {
      projectId: projects[1].id,
      code: 'POBJ-004',
      name: 'Mejorar los hábitos alimenticios de las familias beneficiarias',
      description:
        'Capacitar a las familias en nutrición balanceada, aprovechamiento de productos del huerto y preparación de alimentos saludables.',
      active: true,
    },
    {
      projectId: projects[2].id,
      code: 'POBJ-005',
      name: 'Desarrollar capacidades emprendedoras en jóvenes',
      description:
        'Brindar formación técnica en gestión empresarial, marketing digital y educación financiera a jóvenes emprendedores.',
      active: true,
    },
    {
      projectId: projects[2].id,
      code: 'POBJ-006',
      name: 'Facilitar el acceso a financiamiento inicial para emprendimientos',
      description:
        'Otorgar capital semilla y acompañamiento técnico para la puesta en marcha de emprendimientos juveniles.',
      active: true,
    },
  ]);

  await manager.save(objectives);

  console.log(`✅ ${objectives.length} Objetivos de Proyecto creados.`);
}

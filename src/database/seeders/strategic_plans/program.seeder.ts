import { EntityManager } from 'typeorm';

import { Program } from '../../../modules/programs/entities/program.entity';
import { StrategicPlan } from '../../../modules/strategic-plans/entities/strategic-plan.entity';

export async function programSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Programs...');

  const total = await manager.count(Program);

  if (total > 0) {
    console.log('⏭️ Programs ya fueron poblados.');
    return;
  }

  const strategicPlans = await manager.find(StrategicPlan, {
    order: {
      id: 'ASC',
    },
  });

  if (strategicPlans.length === 0) {
    throw new Error(
      'No existen Planes Estratégicos registrados. Ejecute primero strategicPlanSeeder.',
    );
  }

  const programs: Partial<Program>[] = [
    {
      strategicPlanId: strategicPlans[0].id,
      code: 'PROG-001',
      name: 'Programa de Salud Comunitaria',
      description:
        'Fortalecer el acceso a servicios de salud preventiva en comunidades vulnerables.',
      generalObjective:
        'Mejorar las condiciones de salud de la población mediante acciones preventivas.',
      active: true,
    },
    {
      strategicPlanId: strategicPlans[0].id,
      code: 'PROG-002',
      name: 'Programa de Educación',
      description:
        'Incrementar el acceso y permanencia escolar de niños y adolescentes.',
      generalObjective:
        'Fortalecer el sistema educativo mediante programas de apoyo escolar.',
      active: true,
    },
    {
      strategicPlanId: strategicPlans[0].id,
      code: 'PROG-003',
      name: 'Programa de Protección Social',
      description:
        'Desarrollar acciones orientadas a la protección de grupos vulnerables.',
      generalObjective:
        'Garantizar la protección integral de familias en situación de riesgo.',
      active: true,
    },
    {
      strategicPlanId: strategicPlans[0].id,
      code: 'PROG-004',
      name: 'Programa de Seguridad Alimentaria',
      description:
        'Promover el acceso sostenible a alimentos nutritivos.',
      generalObjective:
        'Reducir la inseguridad alimentaria en comunidades rurales.',
      active: true,
    },
    {
      strategicPlanId: strategicPlans[0].id,
      code: 'PROG-005',
      name: 'Programa de Desarrollo Económico',
      description:
        'Impulsar iniciativas productivas y emprendimientos comunitarios.',
      generalObjective:
        'Incrementar las oportunidades económicas de la población beneficiaria.',
      active: true,
    },
  ];

  const entities = manager.create(Program, programs);

  await manager.save(entities);

  console.log(`✅ ${entities.length} Programas creados.`);
}
import { EntityManager } from 'typeorm';

import { StrategicPlan } from '../../../modules/strategic-plans/entities/strategic-plan.entity';
import { Organization } from '../../../modules/organizations/entities/organization.entity';

export async function strategicPlanSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Strategic Plans...');

  const total = await manager.count(StrategicPlan);

  if (total > 0) {
    console.log('⏭️ Strategic Plans ya fueron poblados.');
    return;
  }

  const organization = await manager.findOne(Organization, {
    where: {},
    order: {
      id: 'ASC',
    },
  });

  if (!organization) {
    throw new Error(
      'Debe existir al menos una organización antes de poblar los Planes Estratégicos.',
    );
  }

  const strategicPlans = manager.create(StrategicPlan, [
    {
      organizationId: organization.id,
      code: 'PE-2025-2029',
      name: 'Plan Estratégico Institucional 2025 - 2029',
      description:
        'Fortalecimiento institucional y desarrollo comunitario.',
      startYear: 2025,
      endYear: 2029,
      active: true,
    },
    {
      organizationId: organization.id,
      code: 'PE-2030-2034',
      name: 'Plan Estratégico Institucional 2030 - 2034',
      description:
        'Innovación institucional y sostenibilidad.',
      startYear: 2030,
      endYear: 2034,
      active: true,
    },
    {
      organizationId: organization.id,
      code: 'PE-2035-2039',
      name: 'Plan Estratégico Institucional 2035 - 2039',
      description:
        'Expansión de programas sociales.',
      startYear: 2035,
      endYear: 2039,
      active: true,
    },
    {
      organizationId: organization.id,
      code: 'PE-2040-2044',
      name: 'Plan Estratégico Institucional 2040 - 2044',
      description:
        'Fortalecimiento territorial y alianzas estratégicas.',
      startYear: 2040,
      endYear: 2044,
      active: true,
    },
    {
      organizationId: organization.id,
      code: 'PE-2045-2049',
      name: 'Plan Estratégico Institucional 2045 - 2049',
      description:
        'Transformación institucional y mejora continua.',
      startYear: 2045,
      endYear: 2049,
      active: true,
    },
  ]);

  await manager.save(strategicPlans);

  console.log(`✅ ${strategicPlans.length} Planes Estratégicos creados.`);
}
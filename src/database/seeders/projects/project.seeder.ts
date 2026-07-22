import { EntityManager } from 'typeorm';

import { Project, ProjectStatus } from '../../../modules/projects/entities/project.entity';
import { Organization } from '../../../modules/organizations/entities/organization.entity';

export async function projectSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Projects...');

  const total = await manager.count(Project);

  if (total > 0) {
    console.log('⏭️ Projects ya fueron poblados.');
    return;
  }

  const organization = await manager.findOne(Organization, {
    where: {},
    order: { id: 'ASC' },
  });

  if (!organization) {
    throw new Error(
      'Debe existir al menos una organización antes de poblar los Proyectos.',
    );
  }

  const projects = manager.create(Project, [
    {
      organizationId: organization.id,
      code: 'PROY-001',
      name: 'Agua Segura para Comunidades Rurales',
      description:
        'Implementación de sistemas de captación, almacenamiento y purificación de agua en comunidades rurales sin acceso a agua potable.',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2027-12-31'),
      status: ProjectStatus.ACTIVE,
      active: true,
    },
    {
      organizationId: organization.id,
      code: 'PROY-002',
      name: 'Huertos Familiares Nutritivos',
      description:
        'Fortalecimiento de la seguridad alimentaria mediante la implementación de huertos familiares y capacitación en nutrición y producción sostenible.',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2027-02-28'),
      status: ProjectStatus.ACTIVE,
      active: true,
    },
    {
      organizationId: organization.id,
      code: 'PROY-003',
      name: 'Fortalecimiento de Emprendimientos Juveniles',
      description:
        'Capacitación técnica, acompañamiento y financiamiento inicial para emprendimientos liderados por jóvenes en zonas urbano-marginales.',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-12-31'),
      status: ProjectStatus.DRAFT,
      active: true,
    },
  ]);

  await manager.save(projects);

  console.log(`✅ ${projects.length} Proyectos creados.`);
}

import { EntityManager } from 'typeorm';

import { ProjectIndicatorAlignment } from '../../../modules/project-indicators/entities/project-indicator-alignment.entity';
import { ProjectIndicator } from '../../../modules/project-indicators/entities/project-indicator.entity';
import { Indicator } from '../../../modules/indicators/entities/indicator.entity';

export async function projectIndicatorAlignmentSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Indicator Alignments...');

  const total = await manager.count(ProjectIndicatorAlignment);

  if (total > 0) {
    console.log('⏭️ Project Indicator Alignments ya fueron poblados.');
    return;
  }

  const projectIndicators = await manager.find(ProjectIndicator, {
    order: { id: 'ASC' },
  });

  if (projectIndicators.length === 0) {
    throw new Error(
      'No existen Indicadores de Proyecto registrados. Ejecute primero projectIndicatorSeeder.',
    );
  }

  const strategicIndicators = await manager.find(Indicator, {
    order: { id: 'ASC' },
  });

  if (strategicIndicators.length === 0) {
    throw new Error(
      'No existen Indicadores Estratégicos registrados. Ejecute primero indicatorSeeder.',
    );
  }

  const alignments = manager.create(ProjectIndicatorAlignment, [
    {
      projectIndicatorId: projectIndicators[0].id,
      strategicIndicatorId: strategicIndicators[0].id,
    },
    {
      projectIndicatorId: projectIndicators[1].id,
      strategicIndicatorId: strategicIndicators[1].id,
    },
  ]);

  await manager.save(alignments);

  console.log(`✅ ${alignments.length} alineaciones de indicadores creadas.`);
}

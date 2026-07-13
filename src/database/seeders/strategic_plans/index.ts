import { DataSource } from 'typeorm';

import { strategicPlanSeeder } from './strategic-plan.seeder';
import { programSeeder } from './program.seeder';
import { objectiveSeeder } from './objective.seeder';
import { resultSeeder } from './result.seeder';
import { activitySeeder } from './activity.seeder';
import { indicatorSeeder } from './indicator.seeder';
import { indicatorYearTargetSeeder } from './indicator-year-target.seeder';
import { indicatorProgressSeeder } from './indicator-progress.seeder';

export async function planningSeeder(
  dataSource: DataSource,
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('=======================================');
    console.log('📋 Módulo Planificación Estratégica');
    console.log('=======================================');

    await strategicPlanSeeder(queryRunner.manager);
    await programSeeder(queryRunner.manager);
    await objectiveSeeder(queryRunner.manager);
    await resultSeeder(queryRunner.manager);
    await activitySeeder(queryRunner.manager);
    await indicatorSeeder(queryRunner.manager);
    await indicatorYearTargetSeeder(queryRunner.manager);
    await indicatorProgressSeeder(queryRunner.manager);

    await queryRunner.commitTransaction();

    console.log('✅ Seeders de planificación completados.');
  } catch (error) {
    await queryRunner.rollbackTransaction();

    console.error('❌ Error ejecutando los seeders de planificación.');
    throw error;
  } finally {
    await queryRunner.release();
  }
}
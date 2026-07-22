import { DataSource } from 'typeorm';

import { projectSeeder } from './project.seeder';
import { projectProgramSeeder } from './project-program.seeder';
import { projectObjectiveSeeder } from './project-objective.seeder';
import { projectResultSeeder } from './project-result.seeder';
import { projectActivitySeeder } from './project-activity.seeder';
import { projectIndicatorSeeder } from './project-indicator.seeder';
import { projectIndicatorYearTargetSeeder } from './project-indicator-year-target.seeder';
import { projectIndicatorProgressSeeder } from './project-indicator-progress.seeder';
import { projectIndicatorAlignmentSeeder } from './project-indicator-alignment.seeder';

export async function projectsSeeder(
  dataSource: DataSource,
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('=======================================');
    console.log('📋 Módulo Proyectos');
    console.log('=======================================');

    await projectSeeder(queryRunner.manager);
    await projectProgramSeeder(queryRunner.manager);
    await projectObjectiveSeeder(queryRunner.manager);
    await projectResultSeeder(queryRunner.manager);
    await projectActivitySeeder(queryRunner.manager);
    await projectIndicatorSeeder(queryRunner.manager);
    await projectIndicatorYearTargetSeeder(queryRunner.manager);
    await projectIndicatorProgressSeeder(queryRunner.manager);
    await projectIndicatorAlignmentSeeder(queryRunner.manager);

    await queryRunner.commitTransaction();

    console.log('✅ Seeders de Proyectos completados.');
  } catch (error) {
    await queryRunner.rollbackTransaction();

    console.error('❌ Error ejecutando los seeders de Proyectos.');
    throw error;
  } finally {
    await queryRunner.release();
  }
}

import { EntityManager } from 'typeorm';

import { ProjectProgram } from '../../../modules/projects/entities/project-program.entity';
import { Project } from '../../../modules/projects/entities/project.entity';
import { Program } from '../../../modules/programs/entities/program.entity';
import { StrategicPlan } from '../../../modules/strategic-plans/entities/strategic-plan.entity';

export async function projectProgramSeeder(
  manager: EntityManager,
): Promise<void> {
  console.log('🌱 Seeding Project Programs...');

  const total = await manager.count(ProjectProgram);

  if (total > 0) {
    console.log('⏭️ Project Programs ya fueron poblados.');
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

  const programs = await manager.find(Program, {
    order: { id: 'ASC' },
  });

  if (programs.length === 0) {
    throw new Error(
      'No existen Programas registrados. Ejecute primero programSeeder.',
    );
  }

  const strategicPlans = await manager.find(StrategicPlan, {
    order: { id: 'ASC' },
  });

  if (strategicPlans.length === 0) {
    throw new Error(
      'No existen Planes Estratégicos registrados. Ejecute primero strategicPlanSeeder.',
    );
  }

  const projectPrograms = manager.create(ProjectProgram, [
    {
      projectId: projects[0].id,
      programId: programs[0].id,
      strategicPlanId: strategicPlans[0].id,
    },
    {
      projectId: projects[1].id,
      programId: programs[3].id,
      strategicPlanId: strategicPlans[0].id,
    },
  ]);

  await manager.save(projectPrograms);

  console.log(`✅ ${projectPrograms.length} asociaciones Proyecto-Programa creadas.`);
}

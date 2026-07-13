import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';

export async function roleSeeder(dataSource: DataSource) {
  const repository = dataSource.getRepository(Role);

  const roles = [
    {
      name: 'ADMIN',
      description: 'Acceso completo al sistema',
    },
    {
      name: 'SUPERVISOR',
      description: 'Supervisión y monitoreo',
    },
    {
      name: 'SOCIAL_WORKER',
      description: 'Trabajador social',
    },
    {
      name: 'PSYCHOLOGIST',
      description: 'Profesional psicólogo',
    },
    {
      name: 'CONSULTANT',
      description: 'Acceso solo lectura',
    },
  ];

  for (const role of roles) {
    const exists = await repository.findOne({
      where: {
        name: role.name,
      },
    });

    if (!exists) {
      await repository.save(role);
    }
  }
}

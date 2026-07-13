import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationUser } from './entities/organization-user.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(
        `La organización con ID ${id} no fue encontrada`,
      );
    }

    return organization;
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    await this.ensureNameNotExists(createOrganizationDto.name);

    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return this.organizationRepository.save(organization);
  }

  async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOne(id);

    if (
      updateOrganizationDto.name &&
      updateOrganizationDto.name !== organization.name
    ) {
      await this.ensureNameNotExists(updateOrganizationDto.name);
    }

    const { ...orgData } = updateOrganizationDto;

    const cleanData = Object.fromEntries(
      Object.entries(orgData).filter(([, value]) => value !== undefined),
    );

    Object.assign(organization, cleanData);
    return this.organizationRepository.save(organization);
  }

  async remove(id: number): Promise<void> {
    const organization = await this.findOne(id);

    await this.organizationUserRepository.delete({
      organization: { id },
    });

    await this.organizationRepository.remove(organization);
  }

  async findUsers(id: number): Promise<User[]> {
    await this.findOne(id);

    const orgUsers = await this.organizationUserRepository.find({
      where: { organization: { id } },
      relations: ['user'],
    });

    return orgUsers.map((ou) => {
      const { password, ...userWithoutPassword } = ou.user;
      return userWithoutPassword as User;
    });
  }

  async assignUsers(id: number, userIds: number[]): Promise<User[]> {
    await this.findOne(id);

    const users = await this.userRepository.findBy({
      id: In(userIds),
    });

    if (users.length !== userIds.length) {
      throw new NotFoundException('Uno o más usuarios no fueron encontrados');
    }

    await this.organizationUserRepository.delete({
      organization: { id },
    });

    const orgUsers = userIds.map((userId) => {
      const ou = new OrganizationUser();
      ou.organization = { id } as Organization;
      ou.user = { id: userId } as User;
      return ou;
    });

    await this.organizationUserRepository.save(orgUsers);

    return this.findUsers(id);
  }

  private async ensureNameNotExists(name: string): Promise<void> {
    const existing = await this.organizationRepository.findOne({
      where: { name },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una organización con el nombre "${name}"`,
      );
    }
  }
}

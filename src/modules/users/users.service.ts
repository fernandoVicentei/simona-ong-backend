import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { firstName: 'ASC' },
    });

    return Promise.all(users.map((user) => this.mapToResponse(user)));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no fue encontrado`);
    }

    return this.mapToResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    await this.ensureEmailNotExists(createUserDto.email);

    const { roleIds, password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    if (roleIds && roleIds.length > 0) {
      await this.assignRolesToUser(savedUser.id, roleIds);
    }

    return this.mapToResponse(savedUser);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no fue encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.ensureEmailNotExists(updateUserDto.email);
    }

    const { roleIds, password, ...rawUserData } = updateUserDto;

    const userData = Object.fromEntries(
      Object.entries(rawUserData).filter(([, value]) => value !== undefined),
    );

    if (password) {
      userData['password'] = await bcrypt.hash(password, 10);
    }

    Object.assign(user, userData);
    await this.userRepository.save(user);

    if (roleIds !== undefined) {
      await this.userRoleRepository.delete({ user: { id } });

      if (roleIds.length > 0) {
        await this.assignRolesToUser(id, roleIds);
      }
    }

    return this.mapToResponse(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no fue encontrado`);
    }

    await this.userRoleRepository.delete({ user: { id } });
    await this.userRepository.remove(user);
  }

  async getRoles(id: number): Promise<Role[]> {
    await this.ensureUserExists(id);

    const userRoles = await this.userRoleRepository.find({
      where: { user: { id } },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role);
  }

  async assignRoles(id: number, roleIds: number[]): Promise<Role[]> {
    await this.ensureUserExists(id);

    const roles = await this.roleRepository.find({
      where: roleIds.map((rid) => ({ id: rid })),
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('Uno o más roles no fueron encontrados');
    }

    await this.userRoleRepository.delete({ user: { id } });
    await this.assignRolesToUser(id, roleIds);

    return this.getRoles(id);
  }

  private async assignRolesToUser(
    userId: number,
    roleIds: number[],
  ): Promise<void> {
    const userRoles = roleIds.map((roleId) => {
      const ur = new UserRole();
      ur.user = { id: userId } as any;
      ur.role = { id: roleId } as any;
      return ur;
    });

    await this.userRoleRepository.save(userRoles);
  }

  private async mapToResponse(user: User): Promise<UserResponseDto> {
    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: user.id } },
      relations: ['role'],
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      position: user.position,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: userRoles.map((ur) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })),
    };
  }

  private async ensureEmailNotExists(email: string): Promise<void> {
    const existing = await this.userRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un usuario con el correo "${email}"`,
      );
    }
  }

  private async ensureUserExists(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no fue encontrado`);
    }

    return user;
  }
}

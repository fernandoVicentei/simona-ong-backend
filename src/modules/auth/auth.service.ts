import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { successResponse } from '../../common/helpers/response.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<
    ApiResponse<{
      accessToken: string;
      user: Omit<User, 'password'>;
    }>
  > {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('El usuario se encuentra inactivo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const lastLogin = new Date();
    await this.userRepository.update(user.id, { lastLogin });
    user.lastLogin = lastLogin;

    const userRoles = await this.userRoleRepository.find({
      where: { user: { id: user.id } },
      relations: ['role'],
    });
    const roles = userRoles.map((ur) => ur.role.name);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
    };

    const accessToken = this.jwtService.sign(payload);

    return successResponse(
      {
        accessToken,
        user: {
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
          organizationUsers: [],
        },
      },
      'Inicio de sesión exitoso',
    );
  }
}

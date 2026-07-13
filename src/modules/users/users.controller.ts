import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Role } from '../roles/entities/role.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
    const data = await this.usersService.findAll();
    return successResponse(data, 'Listado de usuarios obtenido exitosamente');
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserResponseDto>> {
    const data = await this.usersService.findOne(id);
    return successResponse(data, 'Usuario obtenido exitosamente');
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const data = await this.usersService.create(createUserDto);
    return successResponse(data, 'Usuario creado exitosamente');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const data = await this.usersService.update(id, updateUserDto);
    return successResponse(data, 'Usuario actualizado exitosamente');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<null>> {
    await this.usersService.remove(id);
    return successResponse(null, 'Usuario eliminado exitosamente');
  }

  @Get(':id/roles')
  async getRoles(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Role[]>> {
    const data = await this.usersService.getRoles(id);
    return successResponse(data, 'Roles del usuario obtenidos exitosamente');
  }

  @Post(':id/roles')
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleIds') roleIds: number[],
  ): Promise<ApiResponse<Role[]>> {
    const data = await this.usersService.assignRoles(id, roleIds);
    return successResponse(data, 'Roles asignados al usuario exitosamente');
  }
}

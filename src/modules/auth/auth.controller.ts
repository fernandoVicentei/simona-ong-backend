import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<
    ApiResponse<{
      accessToken: string;
      user: {
        id: number;
        firstName: string;
        lastName: string | null;
        email: string;
        phone: string | null;
        position: string | null;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }>
  > {
    return this.authService.login(loginDto);
  }
}

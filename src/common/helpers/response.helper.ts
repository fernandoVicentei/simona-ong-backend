import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';

export function successResponse<T>(
  data: T,
  message: string | string[] = 'Operación exitosa',
  statusCode: number = HttpStatus.OK,
): ApiResponse<T> {
  return { statusCode, message, data };
}

export function errorResponse(
  message: string | string[],
  statusCode: number = HttpStatus.BAD_REQUEST,
  data: null = null,
): ApiResponse<null> {
  return { statusCode, message, data };
}

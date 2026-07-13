export class UserResponseDto {
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
  roles?: {
    id: number;
    name: string;
    description: string | null;
  }[];
}

import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}


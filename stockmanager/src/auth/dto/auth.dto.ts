import { UserRole } from '../../users/entities/user.entity';

export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}


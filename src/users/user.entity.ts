import { UserRole } from './enums/role.enum';

export class User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  active: boolean;
}

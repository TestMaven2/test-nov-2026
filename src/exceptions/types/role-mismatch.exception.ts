import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';

export class RoleMismatchException extends HttpException {
  constructor(id: number, role: UserRole) {
    super(`User with id ${id} is not ${role}`, HttpStatus.BAD_REQUEST);
  }
}

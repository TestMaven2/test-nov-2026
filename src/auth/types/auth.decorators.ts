import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';

export const IS_PUBLIC_KEY: string = 'isPublic';

export const Public: () => CustomDecorator = (): CustomDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY: string = 'roles';

export const Roles: (...roles: UserRole[]) => CustomDecorator = (
  ...roles: UserRole[]
): CustomDecorator => SetMetadata(ROLES_KEY, roles);

// @Public()
// method() {}

// @Roles(AGENT, ADMIN)
// method() {}

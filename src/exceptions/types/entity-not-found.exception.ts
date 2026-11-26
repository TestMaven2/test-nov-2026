import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entityTitle: string, fieldTitle: string, fieldValue: unknown) {
    super(
      `${entityTitle} with ${fieldTitle} ${fieldValue} not found`,
      HttpStatus.NOT_FOUND
    );
  }
}

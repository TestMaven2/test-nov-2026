import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entityTitle: string, id: number) {
    super(`${entityTitle} with id ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

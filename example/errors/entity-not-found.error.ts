import { Error } from 'mongoose';

export class EntityNotFoundError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

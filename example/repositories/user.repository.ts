import { RecursivePopulateRepository, Repository } from '../../src';
import { Entity } from '../constants/enums';
import { userModel } from '../models';
import { RecursivelyPopulatedUser } from '../types/recursive-populate';
import { IUserDocument, IUserPopulated } from '../types/user';
import { EntityNotFoundError } from '../errors/entity-not-found.error';

@Repository({
  entityName: Entity.USER,
  getModel: () => userModel,
  entityType: Entity.USER,
  notFoundErrorClass: EntityNotFoundError,
})
export class UserRepository extends RecursivePopulateRepository<
  IUserDocument,
  IUserPopulated,
  RecursivelyPopulatedUser
> {}

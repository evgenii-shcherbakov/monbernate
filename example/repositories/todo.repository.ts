import { RecursivePopulateRepository, Repository } from '../../src';
import { Entity } from '../constants/enums';
import { todoModel } from '../models';
import { RecursivelyPopulatedTodo } from '../types/recursive-populate';
import { ITodoDocument, ITodoPopulated } from '../types/todo';
import { EntityNotFoundError } from '../errors/entity-not-found.error';

@Repository({
  entityName: Entity.TODO,
  getModel: () => todoModel,
  entityType: Entity.TODO,
  notFoundErrorClass: EntityNotFoundError,
})
export class TodoRepository extends RecursivePopulateRepository<
  ITodoDocument,
  ITodoPopulated,
  RecursivelyPopulatedTodo
> {}

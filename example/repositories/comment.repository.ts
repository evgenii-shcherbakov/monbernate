import { RecursivePopulateRepository, Repository } from '../../src';
import { ICommentDocument, ICommentPopulated } from '../types/comment';
import { RecursivelyPopulatedComment } from '../types/recursive-populate';
import { commentModel } from '../models';
import { Entity } from '../constants/enums';
import { EntityNotFoundError } from '../errors/entity-not-found.error';

@Repository({
  entityName: Entity.COMMENT,
  getModel: () => commentModel,
  entityType: Entity.COMMENT,
  notFoundErrorClass: EntityNotFoundError,
})
export class CommentRepository extends RecursivePopulateRepository<
  ICommentDocument,
  ICommentPopulated,
  RecursivelyPopulatedComment
> {}

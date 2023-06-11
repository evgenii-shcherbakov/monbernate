import { MixinRepository } from '../../src';
import { TodoRepository } from './todo.repository';
import { CommentRepository } from './comment.repository';

export class TodoOrCommentRepository extends MixinRepository<TodoRepository | CommentRepository> {
  protected get repositories(): (TodoRepository | CommentRepository)[] {
    return [this.todoRepository, this.commentRepository];
  }

  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly commentRepository: CommentRepository,
  ) {
    super();
  }
}

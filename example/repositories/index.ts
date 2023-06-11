import { CommentRepository } from './comment.repository';
import { TodoRepository } from './todo.repository';
import { UserRepository } from './user.repository';
import { TodoOrCommentRepository } from './todo-or-comment.repository';

export const commentRepository = new CommentRepository();
export const todoRepository = new TodoRepository();
export const userRepository = new UserRepository();

export const todoOrCommentRepository = new TodoOrCommentRepository(
  todoRepository,
  commentRepository,
);

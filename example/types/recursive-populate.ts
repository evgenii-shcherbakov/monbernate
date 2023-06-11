import { ITodoDocument } from './todo';
import { IUserDocument } from './user';
import { ICommentDocument } from './comment';

export type RecursivelyPopulatedUser = IUserDocument & {
  todos: RecursivelyPopulatedTodo[];
};

export type RecursivelyPopulatedComment = ICommentDocument & {
  author: RecursivelyPopulatedUser;
};

export type RecursivelyPopulatedTodo = ITodoDocument & {
  comments: RecursivelyPopulatedComment[];
};

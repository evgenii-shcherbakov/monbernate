import { Document } from 'mongoose';
import { MongoId } from '../../src';
import { IComment } from './comment';

type Todo = {
  text: string;
  isCompleted: boolean;
  isImportant: boolean;
};

export interface ITodoDocument extends Todo, Document {
  _id: MongoId;
}

export interface ITodo extends ITodoDocument {
  comments: MongoId[];
}

export interface ITodoPopulated extends ITodoDocument {
  comments: IComment[];
}

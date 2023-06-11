import { Document } from 'mongoose';
import { MongoId } from '../../src';
import { ITodo } from './todo';

type User = {
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
};

export interface IUserDocument extends User, Document {
  _id: MongoId;
}

export interface IUser extends IUserDocument {
  todos: MongoId[];
}

export interface IUserPopulated extends IUserDocument {
  todos: ITodo[];
}

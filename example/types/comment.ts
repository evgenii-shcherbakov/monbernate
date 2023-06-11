import { Document } from 'mongoose';
import { MongoId } from '../../src';
import { IUser } from './user';

type Comment = {
  text: string;
};

export interface ICommentDocument extends Comment, Document {
  _id: MongoId;
}

export interface IComment extends ICommentDocument {
  author: MongoId;
}

export interface ICommentPopulated extends ICommentDocument {
  author: IUser;
}

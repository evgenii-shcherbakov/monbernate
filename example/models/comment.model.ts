import { Model, model, Schema } from 'mongoose';
import { ICommentDocument } from '../types/comment';
import { Entity } from '../constants/enums';

const schema = new Schema<ICommentDocument>({
  text: {
    type: Schema.Types.String,
    default: '',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: Entity.USER,
  },
});

export const commentModel = model<ICommentDocument, Model<ICommentDocument>>(
  Entity.COMMENT,
  schema,
);

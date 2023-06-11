import { ITodoDocument } from '../types/todo';
import { model, Model, Schema } from 'mongoose';
import { Entity } from '../constants/enums';

const schema = new Schema<ITodoDocument>({
  text: {
    type: Schema.Types.String,
    default: '',
  },
  isCompleted: {
    type: Schema.Types.Boolean,
    default: false,
  },
  isImportant: {
    type: Schema.Types.Boolean,
    default: false,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: Entity.COMMENT,
    },
  ],
});

export const todoModel = model<ITodoDocument, Model<ITodoDocument>>(Entity.TODO, schema);

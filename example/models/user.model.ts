import { Model, model, Schema } from 'mongoose';
import { IUserDocument } from '../types/user';
import { Entity } from '../constants/enums';

const schema = new Schema<IUserDocument>({
  firstName: {
    type: Schema.Types.String,
    default: '',
  },
  lastName: {
    type: Schema.Types.String,
    default: '',
  },
  email: {
    type: Schema.Types.String,
    default: '',
  },
  picture: {
    type: Schema.Types.String,
  },
  todos: [
    {
      type: Schema.Types.ObjectId,
      ref: Entity.TODO,
    },
  ],
});

export const userModel = model<IUserDocument, Model<IUserDocument>>(Entity.USER, schema);

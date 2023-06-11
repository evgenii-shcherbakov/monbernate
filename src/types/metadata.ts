import { Error, Model } from 'mongoose';
import { ClassType } from './classes';

export type RepositoryMetadata<NotFoundError extends Error = Error> = {
  entityName: string;
  getModel: () => Model<any>;
  entityType?: string;
  notFoundErrorClass?: ClassType<NotFoundError>;
};

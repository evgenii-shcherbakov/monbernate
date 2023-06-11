import { ObjectId } from 'mongoose';
import { ParsedQs } from 'qs';

export type MongoId = string | ObjectId;

export type OptionalMongoId = MongoId | null | undefined;

export type QueryString = string | string[] | ParsedQs | ParsedQs[] | undefined;

export type MongoSortConfig<Entity extends object = object> = {
  [field in keyof Partial<Entity>]: number;
};

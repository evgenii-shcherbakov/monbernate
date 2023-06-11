import 'reflect-metadata';
import { MetadataKey } from '../constants/enums';
import { RepositoryMetadata } from '../types/metadata';

export const Repository = (params: RepositoryMetadata) => {
  return (target) => {
    Reflect.defineMetadata(MetadataKey.REPOSITORY, params, target);
  };
};

import 'reflect-metadata';
import { MetadataKey } from '../constants/enums';
import { RepositoryMetadata } from '../types/metadata';

/**
 * @description Repository decorator
 *
 * @param params repository metadata
 * @constructor
 */
export const Repository = (params: RepositoryMetadata) => {
  return (target) => {
    Reflect.defineMetadata(MetadataKey.REPOSITORY, params, target);
  };
};

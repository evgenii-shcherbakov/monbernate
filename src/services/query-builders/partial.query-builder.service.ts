import { BaseQueryBuilderService } from './base/base.query-builder.service';
import { Query } from 'mongoose';
import { PopulatedProjection, Projection, RecursiveProjection } from '../../types/projection';

export class PartialQueryBuilderService extends BaseQueryBuilderService {
  private convertProjectionObjectToProjectionStringWithExcluding(projectionObject: object): string {
    return Object.keys(projectionObject)
      .reduce(
        (acc: string, key: string) => acc + ` ${(projectionObject[key] ? '' : '-') + key}`,
        '',
      )
      .trim();
  }

  /**
   * @description method for populate query using 2-level population
   *
   * @param query mongoose query object
   * @param field populated field name
   * @param value populate params object
   * @private
   */
  private populate<Entity>(
    query: Query<any, any>,
    field: keyof RecursiveProjection<Entity>,
    value: RecursiveProjection<Entity>[keyof RecursiveProjection<Entity>] | null,
  ): Query<any, any> {
    if (value === null) {
      return query.populate(field);
    }

    if (typeof value === 'string') {
      return query.populate(field, value);
    }

    if (typeof value !== 'object') {
      return query;
    }

    return query.populate(
      field,
      this.convertProjectionObjectToProjectionStringWithExcluding(value) || null,
    );
  }

  /**
   * @description method for use new format projection object
   *
   * @param queryCreator callback for create init query
   * @param projection populated projection object
   */
  build<Entity>(
    queryCreator: (_: Projection<Entity> | null) => Query<any, any>,
    projection: PopulatedProjection<Entity> | null = null,
  ): Query<any, any> {
    return this.populateQueryFactory(
      queryCreator,
      (acc: Query<any, any>, field: string, recursiveProjection: RecursiveProjection<Entity>) => {
        return this.populate(acc, field, recursiveProjection[field]);
      },
      projection,
    );
  }
}

import { BaseQueryBuilderService } from './base/base.query-builder.service';
import { PopulateOptions, Query } from 'mongoose';
import { Projection, RecursiveProjection } from '../../types/projection';

export class RecursiveQueryBuilderService extends BaseQueryBuilderService {
  private convertProjectionObjectToProjectionStringWithoutExcluding(
    projectionObject: object,
  ): string {
    return Object.keys(projectionObject)
      .reduce((acc: string, key: string) => acc + (projectionObject[key] ? ` ${key}` : ''), '')
      .trim();
  }

  /**
   * @description method for recursively create PopulateOptions object for recursive population
   *
   * @param field populated field name
   * @param projection projection params for concrete field
   * @private
   */
  private createPopulateOptionsObj<Entity>(
    field: keyof RecursiveProjection<Entity>,
    projection: RecursiveProjection<Entity>[keyof RecursiveProjection<Entity>] | null,
  ): PopulateOptions {
    const options: PopulateOptions = {
      path: field.toString(),
      populate: [],
      options: {
        lean: true,
      },
    };

    if (typeof projection === 'string') {
      options.select = projection;
      return options;
    }

    if (projection === null) {
      options.select = '';
      return options;
    }

    const basicProjection: Projection | null = this.parseBasicProjection(projection);
    const populatedProjection: RecursiveProjection | null =
      this.parsePopulateProjection(projection);

    options.select = basicProjection
      ? this.convertProjectionObjectToProjectionStringWithoutExcluding(basicProjection) || '_id'
      : basicProjection;

    if (!populatedProjection) {
      return options;
    }

    options.populate = Object.keys(populatedProjection).map((subField: string) =>
      this.createPopulateOptionsObj(subField, populatedProjection[subField]),
    );
    return options;
  }

  /**
   * @description method for use new format projection object with recursive populate
   *
   * @param queryCreator callback for create init query
   * @param projection populated projection object
   */
  build<Entity>(
    queryCreator: (_: Projection<Entity> | null) => Query<any, any>,
    projection: RecursiveProjection<Entity> | null = null,
  ): Query<any, any> {
    return this.populateQueryFactory(
      queryCreator,
      (acc: Query<any, any>, field: string, recursiveProjection: RecursiveProjection<Entity>) => {
        return acc.populate(this.createPopulateOptionsObj(field, recursiveProjection[field]));
      },
      projection,
    );
  }
}

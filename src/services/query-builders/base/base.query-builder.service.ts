import {
  PopulatedOrRecursiveProjection,
  Projection,
  RecursiveProjection,
} from '../../../types/projection';
import { Query } from 'mongoose';

export abstract class BaseQueryBuilderService {
  /**
   * @description method for eject base fields projection (except populates) from new format projection object
   *
   * @param projection projection object in new format
   */
  protected parseBasicProjection<Entity>(
    projection: PopulatedOrRecursiveProjection<Entity> | null = null,
  ): Projection<Entity> | null {
    if (!projection || (typeof projection === 'object' && projection.__all)) {
      return null;
    }

    const projectionObject: Projection = Object.keys(projection).reduce(
      (acc: Projection, key: string) => {
        const value = projection[key];

        if (typeof value === 'number' || typeof value === 'boolean') {
          acc[key] = value;
        }

        return acc;
      },
      {},
    );

    return Object.keys(projectionObject).length ? projectionObject : ({ _id: true } as Projection);
  }

  /**
   * @description method for eject populate fields projection (except base fields) from new format projection object
   *
   * @param projection projection object in new format
   */
  protected parsePopulateProjection<Entity>(
    projection: PopulatedOrRecursiveProjection<Entity> | null = null,
  ): RecursiveProjection<Entity> | null {
    if (!projection) {
      return null;
    }

    return Object.keys(projection).reduce((acc: any, key: string) => {
      const value = projection[key];

      if (value === null || typeof value === 'string' || typeof value === 'object') {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  protected populateQueryFactory<Entity>(
    queryCreator: (_: Projection<Entity> | null) => Query<any, any>,
    populateStrategy: (
      acc: Query<any, any>,
      field: string,
      recursiveProjection: RecursiveProjection<Entity>,
    ) => Query<any, any>,
    projection: PopulatedOrRecursiveProjection<Entity> | null = null,
  ) {
    const query = queryCreator(this.parseBasicProjection(projection));
    const populatedProjection: RecursiveProjection<Entity> | null =
      this.parsePopulateProjection(projection);

    if (!populatedProjection) {
      return query;
    }

    return Object.keys(populatedProjection).reduce(
      (acc: Query<any, any>, field: string) => populateStrategy(acc, field, populatedProjection),
      query,
    );
  }
}

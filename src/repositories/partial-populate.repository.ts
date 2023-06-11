import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { partialQueryBuilderService } from '../services/query-builders';
import { BaseRepository } from './base.repository';
import { MongoSortConfig, OptionalMongoId, QueryString } from '../types/common';
import { PopulatedProjection, Projection } from '../types/projection';
import { parseMongoQueryParams } from '../utils/parsers';

export abstract class PartialPopulateRepository<
  Entity extends object,
  PopulatedEntity,
> extends BaseRepository<Entity> {
  private get getPartiallyPopulatedByIdCallback() {
    return async <T>(
      model: Model<any>,
      id: OptionalMongoId = null,
      projection: PopulatedProjection<T> | null = null,
      options?: QueryOptions,
    ) => {
      return partialQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) => model.findById(id, basicProjection, options),
          projection,
        )
        .lean();
    };
  }

  /**
   * @description method for grab partially populated entity by id
   *
   * @param id
   * @param projection projection modified format for easy manage populates and projection
   * @param options
   */
  async getPartiallyPopulatedById<R = PopulatedEntity>(
    id: OptionalMongoId = null,
    projection: PopulatedProjection<PopulatedEntity> | null = null,
    options?: QueryOptions,
  ): Promise<R> {
    return this.singleEntityQuery<R>(
      async (model: Model<any>) =>
        this.getPartiallyPopulatedByIdCallback(model, id, projection, options),
      id,
    );
  }

  /**
   * @description method for grab partially populated entity by id (return null, if entity not found)
   *
   * @param id
   * @param projection
   * @param options
   */
  async getPartiallyPopulatedByIdOrReturnNull<R = PopulatedEntity>(
    id: OptionalMongoId = null,
    projection: PopulatedProjection<PopulatedEntity> | null = null,
    options?: QueryOptions,
  ): Promise<R | null> {
    return this.getPartiallyPopulatedByIdCallback(this.getModel(), id, projection, options);
  }

  private get getOnePartiallyPopulatedCallback() {
    return async <T>(
      model: Model<any>,
      conditions: FilterQuery<any> = {},
      projection: PopulatedProjection<T> | null = null,
      options?: QueryOptions,
    ) => {
      return partialQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) =>
            model.findOne(conditions, basicProjection, options),
          projection,
        )
        .lean();
    };
  }

  /**
   * @description method for grab one partially populated entity by filter condition
   *
   * @param conditions
   * @param projection
   * @param options
   */
  async getOnePartiallyPopulated<R = PopulatedEntity>(
    conditions: FilterQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
    options?: QueryOptions,
  ): Promise<R> {
    return this.singleEntityQuery<R>(async (model: Model<any>) =>
      this.getOnePartiallyPopulatedCallback(model, conditions, projection, options),
    );
  }

  async getOnePartiallyPopulatedOrReturnNull<R = PopulatedEntity>(
    conditions: FilterQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
    options?: QueryOptions,
  ): Promise<R | null> {
    return this.getOnePartiallyPopulatedCallback(this.getModel(), conditions, projection, options);
  }

  /**
   * @description method for grab array of partially populated entities by filter condition
   *
   * @param conditions
   * @param projection
   * @param limit
   * @param skip
   * @param sort
   */
  async getPartiallyPopulated<R = PopulatedEntity>(
    conditions: FilterQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
    limit: QueryString | number = undefined,
    skip: QueryString | number = undefined,
    sort?: MongoSortConfig<Entity>,
  ): Promise<R[]> {
    return partialQueryBuilderService
      .build(
        (basicProjection: Projection<PopulatedEntity> | null) =>
          this.getModel().find(
            conditions,
            basicProjection,
            parseMongoQueryParams(limit, skip, sort),
          ),
        projection,
      )
      .lean();
  }

  private get updatePartiallyPopulatedByIdCallback() {
    return async <T>(
      model: Model<any>,
      id: OptionalMongoId = null,
      updateQuery: UpdateQuery<any> = {},
      projection: PopulatedProjection<T> | null = null,
    ) => {
      return partialQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) =>
            model.findByIdAndUpdate(id, updateQuery, { projection: basicProjection, new: true }),
          projection,
        )
        .lean();
    };
  }

  async updatePartiallyPopulatedById<R = PopulatedEntity>(
    id: OptionalMongoId = null,
    updateQuery: UpdateQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
  ): Promise<R> {
    return this.singleEntityQuery<R>(
      async (model: Model<any>) =>
        this.updatePartiallyPopulatedByIdCallback(model, id, updateQuery, projection),
      id,
    );
  }

  async updatePartiallyPopulatedByIdOrReturnNull<R = PopulatedEntity>(
    id: OptionalMongoId = null,
    updateQuery: UpdateQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
  ): Promise<R | null> {
    return this.updatePartiallyPopulatedByIdCallback(this.getModel(), id, updateQuery, projection);
  }

  private get updateOnePartiallyPopulatedCallback() {
    return async <T>(
      model: Model<any>,
      conditions: FilterQuery<any> = {},
      updateQuery: UpdateQuery<any> = {},
      projection: PopulatedProjection<T> | null = null,
    ) => {
      return partialQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) =>
            model.findOneAndUpdate(conditions, updateQuery, {
              projection: basicProjection,
              new: true,
            }),
          projection,
        )
        .lean();
    };
  }

  async updateOnePartiallyPopulated<R = PopulatedEntity>(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
  ): Promise<R> {
    return this.singleEntityQuery<R>(async (model: Model<any>) =>
      this.updateOnePartiallyPopulatedCallback(model, conditions, updateQuery, projection),
    );
  }

  async updateOnePartiallyPopulatedOrReturnNull<R = PopulatedEntity>(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
    projection: PopulatedProjection<PopulatedEntity> | null = null,
  ): Promise<R | null> {
    return this.updateOnePartiallyPopulatedCallback(
      this.getModel(),
      conditions,
      updateQuery,
      projection,
    );
  }
}

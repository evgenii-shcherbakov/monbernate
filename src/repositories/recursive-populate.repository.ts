import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { recursiveQueryBuilderService } from '../services/query-builders';
import { PartialPopulateRepository } from './partial-populate.repository';
import { MongoSortConfig, OptionalMongoId, QueryString } from '../types/common';
import { Projection, RecursiveProjection } from '../types/projection';
import { parseMongoQueryParams } from '../utils/parsers';

export abstract class RecursivePopulateRepository<
  Entity extends object,
  PopulatedEntity,
  RecursivelyPopulatedEntity,
> extends PartialPopulateRepository<Entity, PopulatedEntity> {
  private get getRecursivelyPopulatedByIdCallback() {
    return async <T>(
      model: Model<any>,
      id: OptionalMongoId = null,
      projection: RecursiveProjection<T> | null = null,
    ) => {
      return recursiveQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) => model.findById(id, basicProjection),
          projection,
        )
        .lean();
    };
  }

  async getRecursivelyPopulatedById<R = RecursivelyPopulatedEntity>(
    id: OptionalMongoId = null,
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R> {
    return this.singleEntityQuery<R>(
      async (model: Model<any>) => this.getRecursivelyPopulatedByIdCallback(model, id, projection),
      id,
    );
  }

  async getRecursivelyPopulatedByIdOrNull<R = RecursivelyPopulatedEntity>(
    id: OptionalMongoId = null,
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R | null> {
    return this.getRecursivelyPopulatedByIdCallback(this.getModel(), id, projection);
  }

  private get getOneRecursivelyPopulatedCallback() {
    return async <T>(
      model: Model<any>,
      conditions: FilterQuery<any> = {},
      projection: RecursiveProjection<T> | null = null,
    ) => {
      return recursiveQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) => model.findOne(conditions, basicProjection),
          projection,
        )
        .lean();
    };
  }

  async getOneRecursivelyPopulated<R = RecursivelyPopulatedEntity>(
    conditions: FilterQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R> {
    return this.singleEntityQuery<R>(async (model: Model<any>) =>
      this.getOneRecursivelyPopulatedCallback(model, conditions, projection),
    );
  }

  async getOneRecursivelyPopulatedOrReturnNull<R = RecursivelyPopulatedEntity>(
    conditions: FilterQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R | null> {
    return this.getOneRecursivelyPopulatedCallback(this.getModel(), conditions, projection);
  }

  async getRecursivelyPopulated<R = RecursivelyPopulatedEntity>(
    conditions: FilterQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
    limit: QueryString | number = undefined,
    skip: QueryString | number = undefined,
    sort?: MongoSortConfig<Entity>,
  ): Promise<R[]> {
    return recursiveQueryBuilderService
      .build(
        (basicProjection: Projection<RecursivelyPopulatedEntity> | null) =>
          this.getModel().find(
            conditions,
            basicProjection,
            parseMongoQueryParams(limit, skip, sort),
          ),
        projection,
      )
      .lean();
  }

  private get updateRecursivelyPopulatedByIdCallback() {
    return async <T>(
      model: Model<any>,
      id: OptionalMongoId = null,
      updateQuery: UpdateQuery<any> = {},
      projection: RecursiveProjection<T> | null = null,
    ) => {
      return recursiveQueryBuilderService
        .build(
          (basicProjection: Projection<T> | null) =>
            model.findByIdAndUpdate(id, updateQuery, { projection: basicProjection, new: true }),
          projection,
        )
        .lean();
    };
  }

  async updateRecursivelyPopulatedById<R = RecursivelyPopulatedEntity>(
    id: OptionalMongoId = null,
    updateQuery: UpdateQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R> {
    return this.singleEntityQuery<R>(
      async (model: Model<any>) =>
        this.updateRecursivelyPopulatedByIdCallback(model, id, updateQuery, projection),
      id,
    );
  }

  async updateRecursivelyPopulatedByIdOrNull<R = RecursivelyPopulatedEntity>(
    id: OptionalMongoId = null,
    updateQuery: UpdateQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R | null> {
    return this.updateRecursivelyPopulatedByIdCallback(
      this.getModel(),
      id,
      updateQuery,
      projection,
    );
  }

  private get updateOneRecursivelyPopulatedCallback() {
    return async <T>(
      model: Model<any>,
      conditions: FilterQuery<any> = {},
      updateQuery: UpdateQuery<any> = {},
      projection: RecursiveProjection<T> | null = null,
    ) => {
      return recursiveQueryBuilderService
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

  async updateOneRecursivelyPopulated<R = RecursivelyPopulatedEntity>(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R> {
    return this.singleEntityQuery<R>(async (model: Model<any>) =>
      this.updateOneRecursivelyPopulatedCallback(model, conditions, updateQuery, projection),
    );
  }

  async updateOneRecursivelyPopulatedOrNull<R = RecursivelyPopulatedEntity>(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
    projection: RecursiveProjection<RecursivelyPopulatedEntity> | null = null,
  ): Promise<R | null> {
    return this.updateOneRecursivelyPopulatedCallback(
      this.getModel(),
      conditions,
      updateQuery,
      projection,
    );
  }
}

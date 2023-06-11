import 'reflect-metadata';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { RepositoryMetadata } from '../types/metadata';
import { Projection, ProjectionReturn } from '../types/projection';
import { MetadataKey } from '../constants/enums';
import { ClassType } from '../types/classes';
import { MongoSortConfig, OptionalMongoId, QueryString } from '../types/common';
import { parseMongoQueryParams } from '../utils/parsers';

export abstract class BaseRepository<Entity extends object, NotFoundError extends Error = Error> {
  protected readonly metadata: RepositoryMetadata | undefined;
  protected readonly entityName: string = '';

  protected readonly notFoundErrorClass: ClassType<NotFoundError> =
    Error as unknown as ClassType<NotFoundError>;

  constructor() {
    const instance = this['constructor'];

    if (Reflect.hasMetadata(MetadataKey.REPOSITORY, instance)) {
      const metadata: RepositoryMetadata<NotFoundError> = Reflect.getMetadata(
        MetadataKey.REPOSITORY,
        instance,
      );

      this.metadata = metadata;
      this.entityName = metadata.entityName;

      if (metadata.notFoundErrorClass) {
        this.notFoundErrorClass = metadata.notFoundErrorClass;
      }
    }
  }

  protected getModel(): Model<any> {
    if (!this.metadata) {
      throw new Error('Repository model not implemented');
    }

    return this.metadata.getModel();
  }

  protected get associatedEntityType(): string | undefined {
    return this.metadata?.entityType?.valueOf();
  }

  matchByEntityType(entityType: string): boolean {
    return entityType === this.associatedEntityType;
  }

  protected async singleEntityQuery<T = any>(
    callback: (_model: Model<any>) => Promise<T | null>,
    ...requiredParams: any[]
  ): Promise<T> {
    const entityNotFoundError: NotFoundError = new this.notFoundErrorClass(this.entityName);

    if (requiredParams.some((param) => !param)) throw entityNotFoundError;

    const entity: T | null = await callback(this.getModel());

    if (!entity) throw entityNotFoundError;

    return entity;
  }

  async save(dto: Partial<Entity> = {}): Promise<Entity> {
    return new (this.getModel())(dto).save();
  }

  async count(conditions: FilterQuery<any> = {}): Promise<number> {
    return this.getModel().find(conditions).countDocuments();
  }

  async get<P extends Projection<Entity> | null = null>(
    conditions: FilterQuery<any> = {},
    projection: P = null as P,
    limit: QueryString | number = undefined,
    skip: QueryString | number = undefined,
    sort?: MongoSortConfig<Entity>,
  ): Promise<ProjectionReturn<P, Entity>[]> {
    return this.getModel()
      .find(conditions, projection, parseMongoQueryParams(limit, skip, sort))
      .lean();
  }

  async distinct<F extends Extract<keyof Entity, string>>(
    conditions: FilterQuery<any> | undefined,
    field: F,
  ): Promise<Entity[F][]> {
    return (
      (await this.getModel()
        .find(conditions ?? {})
        .distinct(field)) ?? []
    );
  }

  async isExists(conditions: FilterQuery<any> = {}): Promise<boolean> {
    return this.getModel().exists(conditions);
  }

  async isExistsWithId(id: OptionalMongoId = null): Promise<boolean> {
    return id ? this.isExists({ _id: id }) : false;
  }

  async getById<P extends Projection<Entity> | null = null>(
    id: OptionalMongoId = null,
    projection: P = null as P,
    options?: QueryOptions,
  ): Promise<ProjectionReturn<P, Entity>> {
    return this.singleEntityQuery(
      async (model: Model<any>) => model.findById(id, projection, options).lean(),
      id,
    );
  }

  async getByIdOrNull<P extends Projection<Entity> | null = null>(
    id: OptionalMongoId = null,
    projection: P = null as P,
    options?: QueryOptions,
  ): Promise<ProjectionReturn<P, Entity> | null> {
    return this.getModel().findById(id, projection, options).lean();
  }

  async getOne<P extends Projection<Entity> | null = null>(
    conditions: FilterQuery<any> = {},
    projection: P = null as P,
    options?: QueryOptions,
  ): Promise<ProjectionReturn<P, Entity>> {
    return this.singleEntityQuery(async (model: Model<any>) =>
      model.findOne(conditions, projection, options).lean(),
    );
  }

  async getOneOrNull<P extends Projection<Entity> | null = null>(
    conditions: FilterQuery<any> = {},
    projection: P = null as P,
    options?: QueryOptions,
  ): Promise<ProjectionReturn<P, Entity> | null> {
    return this.getModel().findOne(conditions, projection, options).lean();
  }

  async updateById<P extends Projection<Entity> | null = null>(
    id: OptionalMongoId = null,
    updateQuery: UpdateQuery<any> = {},
    projection: P = null as P,
  ): Promise<ProjectionReturn<P, Entity>> {
    return this.singleEntityQuery(
      async (model: Model<any>) =>
        model.findByIdAndUpdate(id, updateQuery, { new: true, projection }).lean(),
      id,
    );
  }

  async updateByIdOrReturnNull<P extends Projection<Entity> | null = null>(
    id: OptionalMongoId = null,
    updateQuery: UpdateQuery<any> = {},
    projection: P = null as P,
  ): Promise<ProjectionReturn<P, Entity> | null> {
    return this.getModel().findByIdAndUpdate(id, updateQuery, { new: true, projection }).lean();
  }

  async updateOne<P extends Projection<Entity> | null = null>(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
    projection: P = null as P,
  ): Promise<ProjectionReturn<P, Entity>> {
    return this.singleEntityQuery(async (model: Model<any>) =>
      model.findOneAndUpdate(conditions, updateQuery, { new: true, projection }).lean(),
    );
  }

  async updateOneOrReturnNull<P extends Projection<Entity> | null = null>(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
    projection: P = null as P,
  ): Promise<ProjectionReturn<P, Entity> | null> {
    return this.getModel()
      .findOneAndUpdate(conditions, updateQuery, { new: true, projection })
      .lean();
  }

  async updateMany(
    conditions: FilterQuery<any> = {},
    updateQuery: UpdateQuery<any> = {},
  ): Promise<unknown> {
    return this.getModel().updateMany(conditions, updateQuery, { multi: true, new: true });
  }

  async deleteMany(conditions: FilterQuery<any> = {}): Promise<unknown> {
    return this.getModel().deleteMany(conditions);
  }

  async deleteById<P extends Projection<Entity> | null = null>(
    id: OptionalMongoId = null,
    projection: P = null as P,
  ): Promise<ProjectionReturn<P, Entity>> {
    return this.singleEntityQuery(
      async (model: Model<any>) => model.findByIdAndDelete(id, { projection }).lean(),
      id,
    );
  }

  async deleteByIdOrReturnNull<P extends Projection<Entity> | null = null>(
    id: OptionalMongoId = null,
    projection: P = null as P,
  ): Promise<ProjectionReturn<P, Entity> | null> {
    return this.getModel().findByIdAndDelete(id, { projection }).lean();
  }
}

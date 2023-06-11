import { MongoId } from './common';
import { LeanDocument } from 'mongoose';

type ConcreteFieldType<T = any> = T[] | T;

type PrimitiveFieldType =
  | ConcreteFieldType<MongoId>
  | ConcreteFieldType<Date>
  | ConcreteFieldType<bigint>
  | ConcreteFieldType<string>
  | ConcreteFieldType<boolean>
  | ConcreteFieldType<number>
  | ConcreteFieldType<symbol>;

type ExcludeOptional<T> = T extends Array<infer I>
  ? Exclude<I, null | undefined>
  : Exclude<T, null | undefined>;

type PrimitiveFieldProjectionType = boolean | number;

type FieldProjectionType<T = any> = T extends Array<infer I> ? Partial<I> : Partial<T>;

type PopulatedProjectionUtilFields = {
  __all?: boolean;
};

export type Projection<T = any> = {
  [field in keyof FieldProjectionType<T>]: PrimitiveFieldProjectionType;
};

type ProjectionReturnId<P extends Projection<T>, T extends Record<string, any>> = P['_id'] extends
  | false
  | 0
  ? {}
  : Pick<T, '_id'>;

export type ProjectionReturn<
  P extends Projection<T> | null,
  T extends Record<string, any>,
> = keyof P extends never
  ? LeanDocument<T>
  : ProjectionReturnId<P, T> & {
      [field in Extract<keyof P, string>]: P[field] extends 1 | true ? T[field] : undefined;
    };

/**
 * @description
 * new format projection object. supports both populates and projection
 *
 * Usage:
 *
 * needInjectAllBaseFields: true - attach all not-populate fields to response
 * true | 1 - use projection for field
 * null - use populate without projection for field
 * { [field]: true | 1 } - use populate with projection (same format as old) for field
 *
 * Examples:
 *
 * User {
 *     firstName: string;
 *     email: string;
 * }
 *
 * Task {
 *     name: string;
 *     active: boolean;
 *     createdBy: User;
 * }
 *
 * #1
 *
 * Projection {
 *     needInjectAllBaseFields: true,
 *     createdBy: { firstName: true }
 * }
 *
 * Will respond:
 *
 * {
 *     name: "",
 *     active: true,
 *     createdBy: {
 *          firstName: "",
 *     },
 * }
 *
 * #2
 *
 * Projection {
 *     name: true,
 *     createdBy: { firstName: true }
 * }
 *
 * Will respond:
 *
 * {
 *     name: "",
 *     createdBy: {
 *          firstName: "",
 *     },
 * }
 *
 * #3
 *
 * Projection {
 *     name: true,
 *     createdBy: null
 * }
 *
 * Will respond:
 *
 * {
 *     name: "",
 *     createdBy: {
 *          firstName: "",
 *          email: "",
 *     },
 * }
 *
 * #4
 *
 * Projection {
 *     name: true
 * }
 *
 * Will respond:
 *
 * {
 *     name: "",
 * }
 */
export type PopulatedProjection<Entity = any> = PopulatedProjectionUtilFields & {
  [field in keyof FieldProjectionType<Entity>]: ExcludeOptional<
    FieldProjectionType<Entity>[field]
  > extends PrimitiveFieldType
    ? PrimitiveFieldProjectionType
    :
        | Projection<ExcludeOptional<FieldProjectionType<Entity>[field]>>
        | PrimitiveFieldProjectionType
        | string
        | null;
};

export type RecursiveProjection<Entity = any> = PopulatedProjectionUtilFields & {
  [field in keyof FieldProjectionType<Entity>]: ExcludeOptional<
    FieldProjectionType<Entity>[field]
  > extends PrimitiveFieldType
    ? PrimitiveFieldProjectionType
    :
        | RecursiveProjection<ExcludeOptional<FieldProjectionType<Entity>[field]>>
        | PrimitiveFieldProjectionType
        | string
        | null;
};

export type PopulatedOrRecursiveProjection<Entity = any> =
  | PopulatedProjection<Entity>
  | RecursiveProjection<Entity>;

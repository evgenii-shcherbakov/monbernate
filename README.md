# monbernate
Mongoose-based ODM inspired by Hibernate and TypeORM

[![npm version](https://img.shields.io/npm/v/monbernate.svg)](https://npmjs.org/package/monbernate)
[![npm license](https://img.shields.io/npm/l/monbernate.svg)](https://npmjs.org/package/monbernate)
[![npm type definitions](https://img.shields.io/npm/types/monbernate)](https://npmjs.org/package/monbernate)

### Install

First, install reflect metadata and monbernate via npm

```shell
npm install reflect-metadata monbernate
```

Add string below in the top of main app file (main.ts, for example)

```typescript
import 'reflect-metadata';
```

Add flags `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in `tsconfig.json` file

### Setup

Declare database repositories, as in example below

```typescript
import { RecursivePopulateRepository, Repository } from '../../src';
import { Entity } from '../constants/enums';
import { userModel } from '../models';
import { RecursivelyPopulatedUser } from '../types/recursive-populate';
import { IUserDocument, IUserPopulated } from '../types/user';
import { EntityNotFoundError } from '../errors/entity-not-found.error';

@Repository({
  entityName: Entity.USER,
  getModel: () => userModel,
  entityType: Entity.USER,
  notFoundErrorClass: EntityNotFoundError,
})
export class UserRepository extends RecursivePopulateRepository<
  IUserDocument,
  IUserPopulated,
  RecursivelyPopulatedUser
> {}
```

Then use declared repositories in app

### Usage

##### BaseRepository.save(dto)

```typescript
const user: IUserDocument = await userRepository.save({ email: 'admin@gmail.com' });
```

##### BaseRepository.count(filter)

```typescript
const userAmount: number = await userRepository.count({ email: 'admin@gmail.com' });
```

##### BaseRepository.get(filter, projection, limit, skip, sort)

Get all entities:

```typescript
const allUsers: LeanDocument<IUserDocument>[] = await userRepository.get();
```

Get entities by filter conditions:

```typescript
const byFirstName: LeanDocument<IUserDocument>[] = await userRepository.get({
  firstName: 'admin',
});
```

Get only needed fields (using projection):

```typescript
const onlyFirstName: { firstName: string }[] = await userRepository.get(
  {},
  { firstName: true, _id: false },
);
```

Get all entities with all fields and limit=100, skip=20 and desc sorting by email field:

```typescript
const withAdditionalParams: LeanDocument<IUserDocument>[] = await userRepository.get(
  {},
  {},
  100,
  20,
  { email: -1 },
);
```

##### BaseRepository.distinct(filter, field)

```typescript
const emails: string[] = await userRepository.distinct({}, 'email');
```

##### BaseRepository.isExists(filter)

```typescript
const isExists: boolean = await userRepository.isExists({ email: 'admin@gmail.com' });
```

##### BaseRepository.isExistsWithId(id)

```typescript
const isExistsWithId: boolean = await userRepository.isExistsWithId('123');
```

##### BaseRepository.getById(id, projection, options)

```typescript
const byId: LeanDocument<IUserDocument> = await userRepository.getById('123');
```

##### BaseRepository.getByIdOrNull(id, projection, options)

```typescript
const byIdNullable: LeanDocument<IUserDocument> | null = await userRepository.getByIdOrNull(
  '123',
);
```

##### BaseRepository.getOne(filter, projection, options)

```typescript
const getOne: LeanDocument<IUserDocument> = await userRepository.getOne({ firstName: 'admin' });
```

##### BaseRepository.getOneOrNull(filter, projection, options)

```typescript
const getOneNullable: LeanDocument<IUserDocument> | null = await userRepository.getOneOrNull({
  firstName: 'admin',
});
```

##### BaseRepository.updateById(id, update, projection)

```typescript
const updateById: LeanDocument<IUserDocument> = await userRepository.updateById('123', {
  email: 'admin@gmail.com',
});
```

##### BaseRepository.updateByIdOrReturnNull(id, update, projection)

```typescript
const updateByIdNullable: LeanDocument<IUserDocument> | null =
  await userRepository.updateByIdOrReturnNull('123', {
    email: 'admin@gmail.com',
  });
```

##### BaseRepository.updateOne(filter, update, projection)

```typescript
const updateOne: LeanDocument<IUserDocument> = await userRepository.updateOne(
  { email: 'user@gmail.com' },
  { email: 'admin@gmail.com' },
);
```

##### BaseRepository.updateOneOrReturnNull(filter, update, projection)

```typescript
const updateOneNullable: LeanDocument<IUserDocument> | null =
  await userRepository.updateOneOrReturnNull(
    { email: 'user@gmail.com' },
    { email: 'admin@gmail.com' },
  );
```

##### BaseRepository.updateMany(filter, update)

```typescript
await userRepository.updateMany({ firstName: 'admin' }, { firstName: 'user' });
```

##### BaseRepository.deleteMany(filter)

```typescript
await userRepository.deleteMany({ firstName: 'admin' });
```

##### BaseRepository.deleteById(id, projection)

```typescript
const deleteById: LeanDocument<IUserDocument> = await userRepository.deleteById('123');
```

##### BaseRepository.deleteByIdOrReturnNull(id, projection)

```typescript
const deleteByIdNullable: LeanDocument<IUserDocument> | null =
  await userRepository.deleteByIdOrReturnNull('123');
```

##### PartialPopulateRepository.getPartiallyPopulatedById(id, projection, options)

```typescript
const byId: Omit<IUserPopulated, 'todos'> & {
  todos: Pick<ITodo, 'comments'>;
} = await userRepository.getPartiallyPopulatedById('123', {
  __all: true, // grab all non-populate fields
  todos: { comments: true },
});
```

##### PartialPopulateRepository.getPartiallyPopulatedByIdOrReturnNull(id, projection, options)

```typescript
const byIdNullable: Pick<IUserPopulated, 'todos'> | null =
  await userRepository.getPartiallyPopulatedByIdOrReturnNull('123', { todos: null });
```

##### PartialPopulateRepository.getOnePartiallyPopulated(filter, projection, options)

```typescript
const getOne: Omit<IUserPopulated, 'todos'> & {
  todos: Pick<ITodo, 'comments'>;
} = await userRepository.getOnePartiallyPopulated({ email: 'admin@gmail.com' }, {
  __all: true, // grab all non-populate fields
  todos: { comments: 1 },
});
```

##### PartialPopulateRepository.getOnePartiallyPopulatedOrReturnNull(filter, projection, options)

```typescript
const getOneNullable: { todos: MongoId[] } | null =
  await userRepository.getOnePartiallyPopulatedOrReturnNull(
    {
      email: 'admin@gmail.com',
    },
    { todos: true },
  );
```

##### PartialPopulateRepository.getPartiallyPopulated(filter, projection, limit, skip, sort)

```typescript
const users: Pick<IUserPopulated, 'firstName' | 'todos'>[] =
  await userRepository.getPartiallyPopulated(
    { email: 'admin@gmail.com' },
    { firstName: true, email: 0, lastName: false, todos: null },
    100,
    20,
    { email: 1 },
  );
```

##### PartialPopulateRepository.updatePartiallyPopulatedById(id, update, projection)

```typescript
const updateById: Pick<IUserPopulated, 'todos'> =
  await userRepository.updatePartiallyPopulatedById(
    '123',
    { firstName: 'admin' },
    { todos: null },
  );
```

##### PartialPopulateRepository.updatePartiallyPopulatedByIdOrReturnNull(id, update, projection)

```typescript
const updateByIdNullable: Pick<IUserPopulated, 'todos'> | null =
  await userRepository.updatePartiallyPopulatedByIdOrReturnNull(
    '123',
    { firstName: 'admin' },
    { todos: null },
  );
```

##### PartialPopulateRepository.updateOnePartiallyPopulated(filter, update, projection)

```typescript
const updateOne: Pick<IUserPopulated, 'todos'> = await userRepository.updateOnePartiallyPopulated(
  { email: 'admin@gmail.com' },
  { firstName: 'admin' },
  { todos: null },
);
```

##### PartialPopulateRepository.updateOnePartiallyPopulatedOrReturnNull(filter, update, projection)

```typescript
const updateOneNullable: Pick<IUserPopulated, 'todos'> | null =
  await userRepository.updateOnePartiallyPopulatedOrReturnNull(
    { email: 'admin@gmail.com' },
    { firstName: 'admin' },
    { todos: null },
  );
```

##### RecursivePopulateRepository

Methods similar like in `PartialPopulateRepository`, but populate object is more deeper

```typescript
type Return = Omit<RecursivelyPopulatedUser, 'todos'> & {
  todos: Pick<ITodo, 'text'> & {
    comments: {
      author: Pick<IUser, 'email' | 'todos'>;
    };
  };
};

const users: Return[] = await userRepository.getRecursivelyPopulated(
  {},
  {
    __all: true,
    todos: {
      text: true,
      comments: {
        author: {
          email: true,
          todos: true,
        },
      },
    },
  },
);
```

##### MixinRepository

```typescript
const repository: CommentRepository | TodoRepository = todoOrCommentRepository.byEntityType(
  Entity.COMMENT,
);

const commentsAmount: number = await repository.count({});
```

### Other

[More examples](example)

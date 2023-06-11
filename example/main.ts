import 'reflect-metadata';
import { todoOrCommentRepository, userRepository } from './repositories';
import { LeanDocument } from 'mongoose';
import { IUser, IUserDocument, IUserPopulated } from './types/user';
import { RecursivelyPopulatedUser } from './types/recursive-populate';
import { ITodo } from './types/todo';
import { MongoId } from '../src';
import { CommentRepository } from './repositories/comment.repository';
import { TodoRepository } from './repositories/todo.repository';
import { Entity } from './constants/enums';

const standardMethods = async () => {
  const user: IUserDocument = await userRepository.save({ email: 'admin@gmail.com' });

  const userAmount: number = await userRepository.count({ email: 'admin@gmail.com' });

  const allUsers: LeanDocument<IUserDocument>[] = await userRepository.get();

  const byFirstName: LeanDocument<IUserDocument>[] = await userRepository.get({
    firstName: 'admin',
  });

  const onlyFirstName: { firstName: string }[] = await userRepository.get(
    {},
    { firstName: true, _id: false },
  );

  const withAdditionalParams: LeanDocument<IUserDocument>[] = await userRepository.get(
    {},
    {},
    100,
    20,
    { email: -1 },
  );

  const emails: string[] = await userRepository.distinct({}, 'email');

  const isExists: boolean = await userRepository.isExists({ email: 'admin@gmail.com' });

  const isExistsWithId: boolean = await userRepository.isExistsWithId('123');

  const byId: LeanDocument<IUserDocument> = await userRepository.getById('123');

  const byIdNullable: LeanDocument<IUserDocument> | null = await userRepository.getByIdOrNull(
    '123',
  );

  const getOne: LeanDocument<IUserDocument> = await userRepository.getOne({ firstName: 'admin' });

  const getOneNullable: LeanDocument<IUserDocument> | null = await userRepository.getOneOrNull({
    firstName: 'admin',
  });

  const updateById: LeanDocument<IUserDocument> = await userRepository.updateById('123', {
    email: 'admin@gmail.com',
  });

  const updateByIdNullable: LeanDocument<IUserDocument> | null =
    await userRepository.updateByIdOrReturnNull('123', {
      email: 'admin@gmail.com',
    });

  const updateOne: LeanDocument<IUserDocument> = await userRepository.updateOne(
    { email: 'user@gmail.com' },
    { email: 'admin@gmail.com' },
  );

  const updateOneNullable: LeanDocument<IUserDocument> | null =
    await userRepository.updateOneOrReturnNull(
      { email: 'user@gmail.com' },
      { email: 'admin@gmail.com' },
    );

  await userRepository.updateMany({ firstName: 'admin' }, { firstName: 'user' });

  await userRepository.deleteMany({ firstName: 'admin' });

  const deleteById: LeanDocument<IUserDocument> = await userRepository.deleteById('123');

  const deleteByIdNullable: LeanDocument<IUserDocument> | null =
    await userRepository.deleteByIdOrReturnNull('123');
};

const partialPopulate = async () => {
  const byId: Omit<IUserPopulated, 'todos'> & {
    todos: Pick<ITodo, 'comments'>;
  } = await userRepository.getPartiallyPopulatedById('123', {
    __all: true, // grab all non-populate fields
    todos: { comments: true },
  });

  const byIdNullable: Pick<IUserPopulated, 'todos'> | null =
    await userRepository.getPartiallyPopulatedByIdOrReturnNull('123', { todos: null });

  const getOne: Omit<IUserPopulated, 'todos'> & {
    todos: Pick<ITodo, 'comments'>;
  } = await userRepository.getOnePartiallyPopulated(
    { email: 'admin@gmail.com' },
    {
      __all: true, // grab all non-populate fields
      todos: { comments: 1 },
    },
  );

  const getOneNullable: { todos: MongoId[] } | null =
    await userRepository.getOnePartiallyPopulatedOrReturnNull(
      {
        email: 'admin@gmail.com',
      },
      { todos: true },
    );

  const users: Pick<IUserPopulated, 'firstName' | 'todos'>[] =
    await userRepository.getPartiallyPopulated(
      { email: 'admin@gmail.com' },
      { firstName: true, email: 0, lastName: false, todos: null },
      100,
      20,
      { email: 1 },
    );

  const updateById: Pick<IUserPopulated, 'todos'> =
    await userRepository.updatePartiallyPopulatedById(
      '123',
      { firstName: 'admin' },
      { todos: null },
    );

  const updateByIdNullable: Pick<IUserPopulated, 'todos'> | null =
    await userRepository.updatePartiallyPopulatedByIdOrReturnNull(
      '123',
      { firstName: 'admin' },
      { todos: null },
    );

  const updateOne: Pick<IUserPopulated, 'todos'> = await userRepository.updateOnePartiallyPopulated(
    { email: 'admin@gmail.com' },
    { firstName: 'admin' },
    { todos: null },
  );

  const updateOneNullable: Pick<IUserPopulated, 'todos'> | null =
    await userRepository.updateOnePartiallyPopulatedOrReturnNull(
      { email: 'admin@gmail.com' },
      { firstName: 'admin' },
      { todos: null },
    );
};

const recursivePopulate = async () => {
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
};

const mixins = async () => {
  const repository: CommentRepository | TodoRepository = todoOrCommentRepository.byEntityType(
    Entity.COMMENT,
  );

  const commentsAmount: number = await repository.count({});
};

const main = async () => {
  await standardMethods();
  await partialPopulate();
  await recursivePopulate();
  await mixins();
};

main();

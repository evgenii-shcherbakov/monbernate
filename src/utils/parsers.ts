import { QueryString, MongoSortConfig } from '../types/common';

export const parseMongoQueryParams = (
  limit: QueryString | number = undefined,
  skip: QueryString | number = undefined,
  sort: MongoSortConfig | undefined = undefined,
) => {
  const parseParam = (param: QueryString | number): number | undefined => {
    if (typeof param === 'number') return param;
    if (typeof param === 'string' && Number.isNaN(+param)) return undefined;
    if (typeof param === 'string') return +param;
    if (Number.isNaN(+param.toString())) return undefined;

    return +param.toString();
  };

  return {
    limit: parseParam(limit),
    skip: parseParam(skip),
    sort,
  };
};

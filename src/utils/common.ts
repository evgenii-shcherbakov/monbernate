import { OptionalMongoId } from '../types/common';

export const compareIds = (firstId?: OptionalMongoId, secondId?: OptionalMongoId): boolean => {
  if (!firstId || !secondId) return false;
  return firstId.toString() === secondId.toString();
};

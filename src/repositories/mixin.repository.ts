import { BaseRepository } from './base.repository';

export abstract class MixinRepository<Repository extends BaseRepository<any>> {
  protected abstract get repositories(): Repository[];

  byEntityType(entityType: string): Repository {
    const repository: Repository | undefined = this.repositories.find((repository: Repository) =>
      repository.matchByEntityType(entityType),
    );

    if (!repository) {
      throw Error(`Can't use repository, associated with entityType ${entityType}`);
    }

    return repository;
  }
}

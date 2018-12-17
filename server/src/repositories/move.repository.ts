import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Move} from '../models';
import {inject} from '@loopback/core';


export class MoveRepository extends DefaultCrudRepository<
  Move,
  typeof Move.prototype._id
> {
  constructor(
    @inject('datasources.db') protected datasource: juggler.DataSource,
  ) {
    super(Move, datasource);
  }
}

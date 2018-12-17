import {DefaultCrudRepository, juggler, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Game, Move} from '../models';
import {inject, Getter} from '@loopback/core';
import {MoveRepository} from './move.repository';

export class GameRepository extends DefaultCrudRepository<
    Game,
    typeof Game.prototype._id
> {
    public readonly moves: HasManyRepositoryFactory<
        Move,
        typeof Game.prototype._id
    >;
    public move: Promise<MoveRepository>;
    constructor(
        @inject('datasources.db') protected datasource: juggler.DataSource,
        @repository.getter(MoveRepository)
        getMoveRepository: Getter<MoveRepository>,
    ) {
        super(Game, datasource);
        this.move = getMoveRepository();
        this.moves = this._createHasManyRepositoryFactoryFor(
            'moves',
            getMoveRepository,
        );
    }
}

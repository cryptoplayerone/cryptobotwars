import {Entity, model, property, hasMany} from '@loopback/repository';
import {Move} from './move.model';

@model()
export class Game extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'number',
    default: 1 * 60 * 1000,
  })
  gameTime: number;

  @property({
    type: 'number',
    default: 1 * 60 * 1000,
  })
  resolveTime: number;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  startTime: Date;

  @property({
    type: 'string',
  })
  winningMove: string;

  @property({
    type: 'string',
  })
  move1: string;

  @property({
    type: 'string',
  })
  move2: string;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'number',
  })
  players: number;

  @hasMany(() => Move, {keyTo: 'gameId'})
  moves?: Move[];

  @property({
    type: 'boolean',
    default: false,
  })
  inProgress: boolean;

  constructor(data?: Partial<Game>) {
    super(data);
  }
}

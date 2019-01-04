import {Entity, Model, model, property, hasMany} from '@loopback/repository';
import {Move} from './move.model';

export interface GameAmountInterface {
    amount: number;
}

@model()
export class GameAmount extends Model {
  @property({
    type: 'number',
    required: true,
  })
  amount: number;
}

@model()
export class PlayerResult extends Model {
  @property({
    type: 'number',
    required: true,
  })
  count: number;

  @property({
    type: 'string',
    required: true,
  })
  move: string;

  @property({
    type: 'object',
    required: true,
  })
  move_count: object;
}

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
    required: true,
  })
  move_amount: number;

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
    type: 'object',
  })
  player1: PlayerResult;

  @property({
    type: 'object',
  })
  player2: PlayerResult;

  @property({
    type: 'string',
  })
  winningMove: string;

  // Each winner gets this amount
  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'number',
  })
  amountGuardian: number;

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

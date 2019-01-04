import {Entity, model, property} from '@loopback/repository';

@model()
export class Move extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  playerId: string;

  @property({
    type: 'string',
  })
  gameId: string;

  @property({
    type: 'string',
    required: true,
  })
  userAddress: string;

  @property({
    type: 'number',
  })
  paymentIdentifier: number;

  @property({
    type: 'string',
    required: true,
  })
  moveHash: string;

  @property({
    type: 'string',
  })
  move?: string;

  @property({
    type: 'string',
  })
  secret?: string;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<Move>) {
    super(data);
  }
}

import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Context} from '@loopback/context';
import {Game, Move, PlayerResult, GameAmount, GameAmountInterface} from '../models';
import {GameRepository} from '../repositories';
import {MoveController} from './move.controller';
import {Raiden} from './raiden.controller';
import {Robot} from './robot.controller';
import {RaidenDataSource, RobotDataSource} from '../datasources';
import {IndexToPlayer, TOKEN, TOKEN_AMOUNT_WEI} from '../constants';

import {RockPaperScissorsGetLoser} from '../rpsWinner';

export class GameController {
  constructor(
    @repository(GameRepository)
    public gameRepository : GameRepository,
  ) {}

  @get('/game/amount', {
    responses: {
        '200': {
          description: 'Game move amount',
          content: {'application/json': {schema: {'x-ts-type': GameAmount}}},
        },
    }
  })
  getAmount(): GameAmountInterface {
    return {
        amount: TOKEN_AMOUNT_WEI,
    };
  }

  @get('/game/create', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: {'x-ts-type': Game}}},
      },
      '403': {
        description: 'Previous game has not ended',
      }
    },
  })
  async create(): Promise<Game> {
    // Return an existing running game or create a new one
    let game: Game, newGame: any = {};
    let now: number, deltaTime: number;

    game = (await this.gameRepository.find({order: ['_id DESC'], limit: 1}))[0];

    if (game) {
        now = new Date().getTime();
        deltaTime = game.startTime.getTime() + game.gameTime;
        if (now < deltaTime) {
            return game;
        }
        if (now < deltaTime + game.resolveTime) {
            throw new HttpErrors.Forbidden('Previous game has not ended');
        }
    }

    newGame.startTime = new Date();
    newGame.move_amount = TOKEN_AMOUNT_WEI;
    return await this.gameRepository.create(newGame);
  }

  @get('/game/count', {
    responses: {
      '200': {
        description: 'Game model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Game)) where?: Where,
  ): Promise<Count> {
    return await this.gameRepository.count(where);
  }

  @get('/game', {
    responses: {
      '200': {
        description: 'Array of Game model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Game}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Game)) filter?: Filter,
  ): Promise<Game[]> {
    return await this.gameRepository.find(filter);
  }

  @patch('/game', {
    responses: {
      '200': {
        description: 'Game PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() game: Game,
    @param.query.object('where', getWhereSchemaFor(Game)) where?: Where,
  ): Promise<Count> {
    return await this.gameRepository.updateAll(game, where);
  }

  @get('/game/{id}', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: {'x-ts-type': Game}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Game> {
    // Check if date is > after resolution time
    // get all game moves sorted -> calculate entire amount received by the game
    // calculate winning move -> count all the winners -> get amount of guardian ->  amount/winner
    // connect to Guardian Raiden node -> get all game payments by payment identifiers (identifier > x)
    // calculate
    // send Raiden payments to all winners
    let game: Game;
    let currentTime, resolveTime, deltaTime;
    let moves: Move[], validMoves: Move[] = [], winningMoves: Move[] = [];
    let moveController;
    let total_amount: number = 0, winner_amount: number, guardian_amount: number;
    let move_count: any = {
        '1': {
            rock: 0,
            paper: 0,
            scissors: 0,
        },
        '2': {
            rock: 0,
            paper: 0,
            scissors: 0,
        }
    };
    let sorted_moves_1: any = [], sorted_moves_2: any = [];
    let winningMove: string, winningPlayer: string, move1: string, move2: string;
    let gameUpdate: Partial<Game>;
    let raidenPayment: any, raidenPayments: any;

    game = await this.gameRepository.findById(id);
    if (!game) {
        throw new HttpErrors.NotFound('Game not found');
    }

    currentTime = new Date().getTime();
    deltaTime = game.gameTime + game.resolveTime;
    resolveTime = game.startTime.getTime() + deltaTime;

    if (
        game.winningMove ||
        game.inProgress ||
        currentTime < resolveTime ||
        currentTime > resolveTime + deltaTime
    ) {
        return game;
    }

    moveController = new MoveController(await this.gameRepository.move);

    moves = await moveController.find({where: {gameId: id}, order: ["_id ASC"]});

    if (moves.length == 0) {
        return game;
    }

    raidenPayments = await this.getRaidenPayments(TOKEN).catch((error) => {
        console.log(error);
    });
    for (let i = 0; i < moves.length; i++) {
        let sentMove: Move = moves[i];

        if (sentMove.amount && sentMove.move && sentMove.amount >= game.move_amount) {
            raidenPayment = raidenPayments[0].find((payment: any) => {
                return payment.identifier === sentMove.paymentIdentifier;
            });
            if (raidenPayment) {
                total_amount += sentMove.amount;
                move_count[sentMove.playerId][sentMove.move] += 1;
                validMoves.push(sentMove);
            }
        }
    }
    console.log('total_amount', total_amount);
    console.log('move_count', move_count);
    sorted_moves_1 = Object.entries(move_count['1']).sort((a: any, b: any) => {
        return a[1] - b[1];
    });
    sorted_moves_2 = Object.entries(move_count['2']).sort((a: any, b: any) => {
        return a[1] - b[1];
    });
    console.log('sorted_moves_1', sorted_moves_1);
    console.log('sorted_moves_2', sorted_moves_2);

    move1 = sorted_moves_1[2][1] > 0 ? sorted_moves_1[2][0] : null;
    move2 = sorted_moves_2[2][1] > 0 ? sorted_moves_2[2][0] : RockPaperScissorsGetLoser[move1];

    // If we have one player, make sure he wins
    if (!move1) {
        move1 = RockPaperScissorsGetLoser[move2];
    }
    winningMove = RockPaperScissorsGetLoser[move1] === move2 ? move1 : move2;
    winningPlayer = move1 === winningMove ? '1' : '2';

    validMoves.forEach((move: Move) => {
        if (move.move === winningMove && move.playerId === winningPlayer) {
            winningMoves.push(move);
        }
    });

    guardian_amount = total_amount / 10;
    total_amount -= guardian_amount;
    winner_amount = total_amount / winningMoves.length;

    gameUpdate = {
        winningMove,
        player1: <PlayerResult> {
            count: sorted_moves_1[0][1] + sorted_moves_1[1][1] + sorted_moves_1[2][1],
            move: move1,
            move_count: move_count['1'],
        },
        player2: <PlayerResult> {
            count: sorted_moves_2[0][1] + sorted_moves_2[1][1] + sorted_moves_2[2][1],
            move: move2,
            move_count: move_count['2'],
        },
        amount: winner_amount,
        amountGuardian: guardian_amount,
        players: moves.length,
    };
    console.log('--gameUpdate', gameUpdate);
    this.updateById(id, gameUpdate);

    // Make Raiden payments to winners
    winningMoves.forEach((move: Move) => {
        this.sendRaidenPayment(TOKEN, move.userAddress, winner_amount, move.paymentIdentifier).catch((error) => {
            console.log(error);
        });
    });

    this.sendRobotCommands(move1, move2, winningMove).catch((error) => {
        console.log(error);
    });

    return game;
  }

  @post('/game/{id}/move', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: {'x-ts-type': Move}}},
      },
    },
  })
  async createMove(
    @param.path.string('id') id: string,
    @requestBody() move: Move,
  ): Promise<Move> {
    let moveController, game;

    moveController = new MoveController(await this.gameRepository.move);

    game = await this.findById(id);
    if (!game) {
        throw new HttpErrors.NotFound('No game found with this id.');
    }

    move.gameId = id;
    let count = await moveController.count();
    move.paymentIdentifier = count.count + 1;
    move.amount = game.move_amount;
    return await moveController.create(move);
  }

  @patch('/game/{id}', {
    responses: {
      '204': {
        description: 'Game PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() game: Partial<Game>,
  ): Promise<void> {
    await this.gameRepository.updateById(id, game);
  }

  @del('/game/{id}', {
    responses: {
      '204': {
        description: 'Game DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.gameRepository.deleteById(id);
  }

  async getRaidenPayments(token: string): Promise<any> {
    const context: Context = new Context();
    context.bind('datasources.raiden').to(RaidenDataSource);
    context.bind('controllers.Raiden').toClass(Raiden);
    const raiden = await context.get<Raiden>(
    'controllers.Raiden',
);
    return await raiden.raiden.payments(token);
  }

  async sendRaidenPayment(token: string, target: string, amount: number, identifier: number): Promise<any> {
    const context: Context = new Context();
    context.bind('datasources.raiden').to(RaidenDataSource);
    context.bind('controllers.Raiden').toClass(Raiden);
    const raiden = await context.get<Raiden>(
    'controllers.Raiden',
    );
    return await raiden.raiden.pay(token, target, amount, identifier);
  }

  async sendRobotCommand(command: string): Promise<any> {
    const context: Context = new Context();
    context.bind('datasources.robot').to(RobotDataSource);
    context.bind('controllers.Robot').toClass(Robot);
    const robot = await context.get<Robot>(
    'controllers.Robot',
    );
    console.log('robot', command);
    return await robot.robot[command]();
  }

  async sendRobotWins(player: string, timeout: number): Promise<any> {
    return this.sendRobotCommand(`${player}_wins`).then(() => {
        return this.wait(timeout);
    }).then(() => {
        return this.sendRobotCommand(`${player}_stop`);
    });
  }

  async sendRobotLoses(player: string, timeout: number): Promise<any> {
    return this.sendRobotCommand(`${player}_loses`).then(() => {
        return this.wait(timeout);
    });
  }

  async sendRobotCommands(
      move1: string,
      move2: string,
      winningMove: string,
  ): Promise<any> {
    let winner: string, loser: string, win_wait: number, lose_wait: number;
    let player1_win_wait: number = 10800;
    let player2_win_wait: number = 6610;

    // TODO: check if connected, otherwise connect
    lose_wait = 4000;
    if (move1 === winningMove) {
        winner = IndexToPlayer[1];
        loser = IndexToPlayer[2];
        win_wait = player1_win_wait;
    } else {
        winner = IndexToPlayer[2];
        loser = IndexToPlayer[1];
        win_wait = player2_win_wait;
    }

    return await this.wait(2000).then(() => {
        return this.sendRobotCommand(`${IndexToPlayer[1]}_${move1}`)
    }).then(() => {
        return this.wait(2500);
    }).then(() => {
        return this.sendRobotCommand(`${IndexToPlayer[2]}_${move2}`);
    }).then(() => {
        return this.wait(2500);
    }).then(() => {
        if (move1 === move2) {
            return this.sendRobotWins(loser, player2_win_wait);
        } else {
            return this.sendRobotLoses(loser, lose_wait);
        }
    }).then(() => {
        return this.sendRobotWins(winner, win_wait);
    }).then(() => {
        return this.wait(1000);
    }).then(() => {
        return this.sendRobotCommand(`${IndexToPlayer[1]}_stage`);
    }).then(() => {
        return this.sendRobotCommand(`${IndexToPlayer[2]}_stage`);
    }).catch((error) => {
        console.log(error);
    });
  }

  async wait(timeout: number): Promise<any> {
      return new Promise((resolve, reject) => {
          setTimeout(function() {
              resolve();
          }, timeout);
      });
  }
}

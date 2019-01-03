<template>
    <v-container fill-height nomargin>
        <v-layout text-xs-center wrap v-if="move && raiden_payment && !winningMove">
            <youtube
                video-id="_lB6bvv_TpA"
                :player-vars="{ autoplay: 1 }"
                :class="[videoPlaying ? 'backgr-vid-play' : 'backgr-vid-end', 'full']"
                @ended="videoEnded"
                @ready="videoReady"
                player-width="98%"
                player-height="100%"
            ></youtube>
        </v-layout>
        <v-layout
            text-xs-center wrap
            :class="[(!videoPlaying || winningMove) ? '' : 'backr-text']"
        >
            <v-flex xs12>
                <div class="subheading">Outcome: </div>
            </v-flex>
            <v-flex xs12>
                <GameClosedChoices

                    :player="player"
                    :move="MovesToIndex[our_player.move] || move"
                    :us="our_player.move ? (MovesToIndex[our_player.move] === move ? 1 : 0) : 1"
                    :player_info="our_player.count ? `${our_player.count} players` : ''"
                    :move_info="(our_player.move_count && our_player.count) ? `${our_player.move_count[IndexToMoves[move]]}/${our_player.count} votes` : ''"
                />
            </v-flex>

            <v-flex xs8 offset-xs2 v-if="our_player.move_values">
                <!-- <v-flex xs12>
                    <bars
                      :data="our_player.move_values || []"
                      :gradient="['#ffffff', '#ffffff']"
                      :barWidth="30"
                      :height="70"
                      >
                    </bars>
                </v-flex> -->
                <v-layout row>
                    <v-flex xs2 offset-xs2>
                        <v-icon :color="`${IndexToMoves[move] === 'rock' ? 'white' : 'grey darken-1'}`">fa-hand-rock</v-icon>
                        <p class="subheading" text-xs-center wrap>{{our_player.move_count.rock}}</p>
                    </v-flex>
                    <v-flex xs2 offset-xs2>
                        <v-icon :color="`${IndexToMoves[move] === 'paper' ? 'white' : 'grey darken-1'}`">fa-hand-paper</v-icon>
                        <p class="subheading" text-xs-center wrap>{{our_player.move_count.paper}}</p>
                    </v-flex>
                    <v-flex xs2 offset-xs2>
                        <v-icon :color="`${IndexToMoves[move] === 'scissors' ? 'white' : 'grey darken-1'}`">fa-hand-scissors</v-icon>
                        <p class="subheading" text-xs-center wrap>{{our_player.move_count.scissors}}</p>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs12 v-if="winningMove">
                <p class="display-2">{{ `You ${MovesToIndex[winningMove] === move ? 'won!': 'lost...'}`}}</p>
                <p class="subheading" v-if="MovesToIndex[winningMove] === move">
                    Wait for the off-chain reward.
                </p>
            </v-flex>
            <v-flex xs12></v-flex>
            <v-flex xs12>
                <div class="subheading">Opponents: </div>
            </v-flex>
            <v-flex xs12>
                <GameClosedChoices
                    :player="opponent()"
                    :move="opponentMove"
                    :timer="timer"
                    :us="0"
                    :player_info="opponent_player.count || ''"
                    :move_info="(opponent_player.move_count && opponent_player.count) ? `${opponent_player.move_count[IndexToMoves[opponentMove]]}/${opponent_player.count}` : ''"
                    v-on:timer-end="$emit('timer-end')"
                />
            </v-flex>

            <v-flex xs8 offset-xs2 v-if="opponent_player.move_values">
                <!-- <bars
                  :data="opponent_player.move_values || []"
                  :gradient="['#ffffff', '#ffffff']"
                  :barWidth="30"
                  :height="70"
                  >
                </bars> -->
                <v-layout row>
                    <v-flex xs2 offset-xs2>
                        <v-icon color="grey darken-1">fa-hand-rock</v-icon>
                        <p class="subheading" text-xs-center wrap>{{opponent_player.move_count.rock}}</p>
                    </v-flex>
                    <v-flex xs2 offset-xs2>
                        <v-icon color="grey darken-1">fa-hand-paper</v-icon>
                        <p class="subheading" text-xs-center wrap>{{opponent_player.move_count.paper}}</p>
                    </v-flex>
                    <v-flex xs2 offset-xs2>
                        <v-icon color="grey darken-1">fa-hand-scissors</v-icon>
                        <p class="subheading" text-xs-center wrap>{{opponent_player.move_count.scissors}}</p>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs12 v-if="winningPayment">
                <div v-if="MovesToIndex[winningMove] === move">
                    <p class="subheading" text-xs-center wrap>
                        {{displayWinningPayment()}}
                    </p>
                </div>
                <v-btn
                    large round
                    v-on:click="$emit('restart-game')"
                >Duel Again!</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { IndexToPlayer, MovesToIndex, IndexToMoves, GameGuardian, Network } from '../constants';
import GameClosedChoices from './GameClosedChoices';
import Timer from './Timer';

export default {
    components: {
        GameClosedChoices,
        Timer,
    },
    props: ['game', 'timer', 'player', 'move', 'winningPayment', 'raiden_payment'],
    data: () => ({
        IndexToPlayer,
        MovesToIndex,
        IndexToMoves,
        winningMove: null,
        opponentMove: null,
        videoPlaying: false,
        our_player: {},
        opponent_player: {},
    }),
    watch: {
        game() {
            if (!this.game[`player${this.player}`]) return;
            let our_player = JSON.parse(JSON.stringify(
                this.game[`player${this.player}`]
            ));
            let opponent_player = JSON.parse(JSON.stringify(
                this.game[`player${this.opponent()}`]
            ));

            let opponentMove = opponent_player.move;
            if (opponentMove) this.opponentMove = MovesToIndex[opponentMove];
            if (this.game.winningMove) this.winningMove = this.game.winningMove;

            if (our_player) {
                let move_values = Object.entries(our_player.move_count).map(move => {
                    return {value: move[1] || 0.2, title: `${move[0]}: ${move[1]}`};
                });
                our_player.move_values = [{value: 0, title: ''}].concat(move_values);
            }

            if (opponent_player) {
                if (!opponent_player.count) {
                    opponent_player.count = 1;
                    opponent_player.move_count[opponentMove] = 1;
                }
                let move_values = Object.entries(opponent_player.move_count).map(move => {
                    return {value: move[1] || 0.2, title: `${move[0]}: ${move[1]}`};
                });
                opponent_player.move_values = [{value: 0, title: ''}].concat(move_values);
            }

            this.our_player = our_player;
            this.opponent_player = opponent_player;
        }
    },
    methods: {
        opponent() {
            return this.player ? (3 - this.player) : null;
        },
        displayWinningPayment() {
            if (typeof this.winningPayment === 'string') {
                return this.winningPayment;
            }
            return `You have received a micropayment from CryptoWars Guardian ${GameGuardian.raiden_address[Network]} of ${parseFloat(this.winningPayment.amount / 10**18).toFixed(18)} WETH with identifier ${this.winningPayment.identifier} at log_time ${this.winningPayment.log_time}.`
        },
        videoEnded() {
            this.videoPlaying = false;
        },
        videoReady() {
            this.videoPlaying = true;
        }
    }
}
</script>

<style>
.nomargin {
    margin: 0;
    padding: 0;
}
.full {
    height: 100px;
    width: 100px;
}
.backgr-vid-play iframe{
    position: absolute;
    opacity: 1;
}
.backgr-vid-end iframe{
    z-index: -1;
    position: absolute;
    opacity: 0;
}
.backr-text {
    opacity: 0;
}
</style>

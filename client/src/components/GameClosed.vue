<template>
    <v-container fill-height nomargin>
        <v-layout text-xs-center wrap v-if="move">
            <youtube
                :video-id="'1L5gW1fhmbc'"
                :player-vars="{ autoplay: 1 }"
                :class="[videoPlaying ? 'backgr-vid-play' : 'backgr-vid-end', 'full']"
                @ended="videoEnded"
                @ready="videoReady"
                player-width="98%"
                player-height="100%"
                :mute="true"
            ></youtube>
        </v-layout>
        <v-layout
            text-xs-center wrap
            :class="[(!videoPlaying || winningMove) ? '' : 'backr-text']"
        >
            <v-flex xs12 v-if="winningMove">
                <v-btn
                    large fab
                >
                    <v-icon x-large>{{ `fa-hand-${winningMove}` }}</v-icon>
                </v-btn>
                <p class="display-2">{{ `You ${MovesToIndex[winningMove] === move ? 'won!': 'lost..'}`}}</p>
                <p class="subheading" v-if="MovesToIndex[winningMove] === move">
                    {{`You should receive ${parseFloat(game.amount / 10**18).toFixed(13)} WETH`}}
                </p>
            </v-flex>
            <v-flex xs12>
                <div class="subheading">Your choices: </div>
            </v-flex>
            <GameClosedChoices :player="player" :move="move" :us="1"/>

            <v-flex xs12>
                <div class="subheading">Opponent's choices: </div>
            </v-flex>
            <GameClosedChoices
                :player="opponent()"
                :move="opponentMove"
                :timer="timer"
                :us="0"
                v-on:timer-end="$emit('timer-end')"
            />

            <v-flex xs12 v-if="winningPayment">
                <div v-if="MovesToIndex[winningMove] === move">
                    <p class="subheading">
                        {{`You won ${parseFloat(winningPayment.amount / 10**18).toFixed(13)} WETH.`}}
                    </p>
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
import { IndexToPlayer, MovesToIndex, GameGuardian, Network } from '../constants';
import GameClosedChoices from './GameClosedChoices';
import Timer from './Timer';

export default {
    components: {
        GameClosedChoices,
        Timer,
    },
    props: ['game', 'timer', 'player', 'move', 'winningPayment'],
    data: () => ({
        IndexToPlayer,
        MovesToIndex,
        winningMove: null,
        opponentMove: null,
        videoPlaying: false,
    }),
    watch: {
        game() {
            let opponentMove = this.game[`move${this.opponent()}`];
            if (opponentMove) this.opponentMove = MovesToIndex[opponentMove];
            if (this.game.winningMove) this.winningMove = this.game.winningMove;
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
            return `Guardian ${GameGuardian.raiden_address[Network]} sent you a micropayment with identifier ${this.winningPayment.identifier} at log_time ${this.winningPayment.log_time}.`
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

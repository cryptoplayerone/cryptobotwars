<template>
    <v-container fill-height>
        <v-layout wrap text-xs-center>
            <v-flex xs12>
                <Timer
                    :time="timer.intervalGame || 0"
                    :startValue="timer.value || 0"
                    size="100"
                    color="white"
                    v-on:timer-end="$emit('timer-end')"
                />
                </br>
            </v-flex>
            <v-flex xs12>
                <div class="display-1">Choose:</div>
            </v-flex>
            <v-flex xs12>
                <v-avatar class="v-btn v-btn--depressed theme--light v-btn--floating"
                    :size="120"
                    :color="player === PlayerToIndex.vader ? '' : '#1E1E1E'"
                    v-on:click.stop="choosePlayer(PlayerToIndex.vader)"
                >
                    <img src="/vader_t2.png" alt="avatar">
                </v-avatar>
                <v-avatar class="v-btn v-btn--depressed theme--light v-btn--floating"
                    :size="120"
                    :color="player === PlayerToIndex.yoda ? '' : '#1E1E1E'"
                    v-on:click.stop="choosePlayer(PlayerToIndex.yoda)"
                >
                    <img src="/yoda_t2.png" alt="avatar">
                </v-avatar>
                </br>
            </v-flex>
            <v-flex xs12>
                <v-btn
                    v-on:click.stop="chooseMove(MovesToIndex.rock)"
                    :light="move === MovesToIndex.rock ? true : false"
                    large fab depressed
                >
                    <v-icon dark x-large>fa-hand-rock</v-icon>
                </v-btn>
                <v-btn
                    v-on:click.stop="chooseMove(MovesToIndex.paper)"
                    :light="move === MovesToIndex.paper ? true : false"
                    large fab depressed
                >
                    <v-icon dark x-large>fa-hand-paper</v-icon>
                </v-btn>
                <v-btn
                    v-on:click.stop="chooseMove(MovesToIndex.scissors)"
                    :light="move === MovesToIndex.scissors ? true : false"
                    large fab depressed
                >
                    <v-icon dark x-large class="fa-rotate-90">fa-hand-scissors</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12>
                </br>
                <div class="subheading">You will pay {{parseFloat(GameGuardian.amount / 10**18).toFixed(13)}} WETH.</div>
            </v-flex>
            <v-flex xs12>
                </br></br>
                <v-btn
                    v-on:click.stop="$emit('play')"
                    large fab
                    :disabled="!player || !move"
                >
                    <v-icon light x-large>fa-check</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { MovesToIndex, PlayerToIndex, GameGuardian } from '../constants';
import Timer from './Timer';

export default {
    props: ['timer', 'player', 'move'],
    components: {
        Timer,
    },
    data: () => ({
        MovesToIndex,
        PlayerToIndex,
        GameGuardian,
    }),
    methods: {
        choosePlayer(index) {
            this.$emit('player-chosen', index);
        },
        chooseMove(index) {
            this.$emit('move-chosen', index);
        }
    }
}
</script>

<style>
.mrgtop {
    margin-top: 20px;
}
</style>

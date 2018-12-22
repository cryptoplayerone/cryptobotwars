<template>
    <v-layout wrap>
        <v-flex xs2 offset-xs4>
            <v-avatar
                class="v-btn v-btn--depressed v-btn--floating"
                :size="80"
                :light="us === '1'"
                v-on:click.stop="choosePlayer(PlayerToIndex.vader)"
            >
                <img :src="`./${IndexToPlayer[player]}_t2.png`" alt="avatar">
            </v-avatar>
        </v-flex>
        <v-flex xs2>
            <v-btn v-if="move"
                large fab light
            >
                <v-icon dark x-large>{{ `fa-hand-${IndexToMoves[move]}` }}</v-icon>
            </v-btn>
            <Timer v-else-if="timer"
                :time="timer.intervalResolve"
                :startValue="timer.value"
                size="90"
                color="white"
                v-on:timer-end="$emit('timer-end')"
            />
        </v-flex>
    </v-layout>
</template>

<script>
import { IndexToPlayer, IndexToMoves } from '../constants';
import Timer from './Timer';

export default {
    components: {
        Timer,
    },
    props: ['timer', 'player', 'move', 'us'],
    data: () => ({
        IndexToPlayer,
        IndexToMoves,
    }),
}
</script>

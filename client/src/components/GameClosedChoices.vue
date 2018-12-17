<template>
    <v-layout wrap>
        <v-flex xs2 offset-xs4>
            <v-img v-if="player"
              :src="`./${IndexToPlayer[player]}.svg`"
              aspect-ratio="1"
              height="72px"
              width="72px"
              class="margin"
            ></v-img>
        </v-flex>
        <v-flex xs2>
            <v-btn v-if="move"
                large fab
            >
                <v-icon x-large>{{ `fa-hand-${IndexToMoves[move]}` }}</v-icon>
            </v-btn>
            <Timer v-else-if="timer"
                :time="timer.intervalResolve"
                :startValue="timer.value"
                size="100"
                color="black"
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
    props: ['timer', 'player', 'move'],
    data: () => ({
        IndexToPlayer,
        IndexToMoves,
    }),
}
</script>

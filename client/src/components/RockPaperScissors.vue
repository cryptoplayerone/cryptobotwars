<template>
    <v-layout row wrap text-xs-center>
        <v-flex xs4>
            <v-btn
                v-on:click.stop="$emit('move-chosen', MovesToIndex.rock)"
                large fab
            >
                <v-icon light x-large>fa-hand-rock</v-icon>
            </v-btn>
        </v-flex>
        <v-flex xs4>
            <v-btn
                v-on:click.stop="$emit('move-chosen', MovesToIndex.paper)"
                large fab
            >
                <v-icon light x-large>fa-hand-paper</v-icon>
            </v-btn>
        </v-flex>
        <v-flex xs4>
            <v-btn
                v-on:click.stop="$emit('move-chosen', MovesToIndex.scissors)"
                large fab
            >
                <v-icon light x-large class="fa-rotate-90">fa-hand-scissors</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
import { MovesToIndex } from '../constants';

// class="fa-flip-horizontal"
export default {
    data: () => ({
        MovesToIndex,
    }),
}
</script>

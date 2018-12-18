<template>
        <v-layout
            align-center
            column
            justify-center
            class="mrg-top"
        >
            <v-img
                position="center center"
                src="/Death-Star-v2.png"
                height="300px"
                max-height="300px"
                width="300px"
                aspect-ratio="1"
                class="margin"
            ></v-img>
            <div class="display-2">Ready to play?</div>
            <div class="subheading font-italic">(And may the Tokens be with you!)</div>
            <v-btn
                large fab
                v-on:click="$emit('go')"
            >Go!</v-btn>
        </v-layout>
</template>

<style>
.mrg-top {
    margin-top: 5%;
}
.fit {
    height: 100%;
}
</style>

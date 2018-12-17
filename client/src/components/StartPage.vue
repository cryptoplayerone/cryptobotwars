<template>
    <v-flex xs12 text-xs-center align-self-center>
        <v-img
            position="center center"
            src="/deaths.svg"
            height="300px"
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
    </v-flex>
</template>

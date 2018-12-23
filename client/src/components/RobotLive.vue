<template>
    <iframe
        class="stream"
        frameborder="0"
        :src="stream"
    ></iframe>
</template>

<script>
import Vue from 'vue';

export default {
    props: ['stream'],
}
</script>

<style>
.stream {
    width: 100%;
    height: 70%;
}
</style>

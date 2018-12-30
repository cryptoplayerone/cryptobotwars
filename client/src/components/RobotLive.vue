<template>
    <!-- <iframe
        class="stream"
        frameborder="0"
        :src="stream"
    ></iframe> -->
    <twitch-player
        ref="player"
        class="stream"
        :channel="channel"
        :volume="volume"
        height="100%"
        width="100%"
        @ready="ready"
    />
</template>

<script>
import Vue from 'vue';
import TwitchLive from './TwitchLive';

export default {
    components: {
        'twitch-player': TwitchLive,
    },
    // props: ['stream'],
    data() {
        return {
            player: null,
            channel: 'cryptobotwars',
            volume: 0,
            quality: 'medium',
        }
    },
    mounted() {
        this.player = this.$refs.player;
    },
    methods: {
        ready() {
            setTimeout(() => {
                this.volume = 1;
                console.log('volume', this.player.getVolume(), this.player.isMuted());
            }, 60000);
        }
    }
}
</script>

<style>
.stream {
    width: 100%;
    height: 70%;
}
</style>

<template>
    <youtube
        :video-id="liveVideoId"
        :player-vars="{ autoplay: 1 }"
        :mute="true"
        class="backgr-live-play fullheight"
        player-width="100%"
        player-height="100%"
        @ready="ready"
    ></youtube>
</template>

<script>
import Vue from 'vue';
const liveUrl = 'https://www.googleapis.com/youtube/v3/search?part=id&channelId=UCcLwc75SpR9tRhB9gUycs5Q&eventType=live&type=video&key=AIzaSyANfKJa3-gHkW1h7lozDd-xQNctP50ZCzM';

export default {
    data() {
        return {
            liveVideoId: null,
            player: null,
        }
    },
    mounted() {
        Vue.axios.get(liveUrl).then((response) => {
            console.log('response liveUrl', response);
            if (response.data && response.data.items.length) {
                this.liveVideoId = response.data.items[0].id.videoId;
            }
        });
    },
    methods: {
        ready(event) {
            this.player = event.target;
        },
    }
}
</script>

<style>
.backgr-live-play {

}
</style>

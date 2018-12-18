<template>
  <v-app dark>
    <v-content class="backgr">
        <Game
            :userInfo="userInfo"
            v-on:needs-info="needsInfo()"
        />
        <HelpMenu
            :infoRequired="infoRequired"
            :userInfo="userInfo"
            v-on:set-info="setInfo"
        />
    </v-content>
  </v-app>
</template>

<script>
import HelpMenu from './components/HelpMenu';
import Game from './components/Game';

export default {
    name: 'App',
    components: {
        HelpMenu,
        Game,
    },
    data () {
        return {
            userInfo: {},
            infoRequired: false,
        }
    },
    methods: {
        setInfo(info) {
            this.userInfo = info;
        },
        needsInfo() {
            this.infoRequired = true;
        }
    }
}
</script>

<style>
.backgr {
    background-color: black;
}
</style>

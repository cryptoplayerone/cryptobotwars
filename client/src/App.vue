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
            :gameAddresses="gameAddresses"
            v-on:set-info="setInfo"
        />
    </v-content>
  </v-app>
</template>

<script>
import HelpMenu from './components/HelpMenu';
import Game from './components/Game';
import { GameGuardian, Network } from './constants';

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
            gameAddresses: {
                token: GameGuardian.token_address[Network],
                guardian: GameGuardian.raiden_address[Network],
            },
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

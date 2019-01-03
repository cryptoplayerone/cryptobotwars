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
        <v-btn absolute small top right fab
            class="menu chat-btn"
            @click="openChat()"
        >
            <v-icon>fa-comments</v-icon>
        </v-btn>
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
                amount: GameGuardian.amount,
                chat: GameGuardian.chat,
            },
        }
    },
    methods: {
        setInfo(info) {
            this.userInfo = info;
        },
        needsInfo() {
            this.infoRequired = true;
        },
        openChat() {
            window.open(GameGuardian.chat, '_blank');
        }
    }
}
</script>

<style>
.backgr {
    background-color: black;
}
.chat-btn {
    margin-right: 35px;
}
</style>

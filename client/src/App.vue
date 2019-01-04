<template>
  <v-app dark>
    <v-content class="backgr">
        <Game
            :userInfo="userInfo"
            :guardianApi="guardianApi"
            :gameGuardianAmount="gameGuardianAmount"
            v-on:needs-info="needsInfo()"
        />
        <HelpMenu
            :infoRequired="infoRequired"
            :userInfo="userInfo"
            :gameAddresses="gameAddresses"
            :chatUrl="chatUrl"
            :amount="gameGuardianAmount"
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
import Vue from 'vue';
import HelpMenu from './components/HelpMenu';
import Game from './components/Game';
import { GameGuardian, Network } from './constants';
import { GuardianApi } from './utils';

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
            chatUrl: GameGuardian.chat,
            gameGuardianAmount: 0,
            guardianApi: new GuardianApi(
                Vue.axios,
                GameGuardian.host,
            ),
        }
    },
    mounted() {
        this.guardianApi.getAmount().then((response) => {
            if (!response.data) {
                throw new Error('No move amount received from the server');
            }
            this.gameGuardianAmount = response.data.amount;
        }).catch(console.log);
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

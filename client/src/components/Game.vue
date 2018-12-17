<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <v-container fill-height>
                <v-layout>
                    <StartPage v-on:go="nextSlide()"/>
                </v-layout>
            </v-container>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <v-layout text-xs-center wrap>
                <v-flex xs12>
                    <GameOpen
                        :timer="timer"
                        v-on:player-chosen="setPlayer"
                        v-on:move-chosen="setMove"
                        v-on:play="userPlay"
                        v-on:timer-end="gameTimerEnd"
                    />
                </v-flex>
            </v-layout>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <GameClosed
                v-if="game"
                :game="game"
                :timer="timer"
                :player="player"
                :move="move"
                :winningPayment="winningPayment"
                v-on:timer-end="resolveTimerEnd"
                v-on:restart-game="restartGame()"
            />
        </swiper-slide>

        <!-- <v-btn absolute small top left fab
            color="white"
            slot="button-prev"
            class="nav prev"
        >
            <v-icon>fa-chevron-left</v-icon>
        </v-btn>
        <v-btn absolute small top right fab
            color="white"
            class="nav next"
            slot="button-next"
        >
            <v-icon>fa-chevron-right</v-icon>
        </v-btn> -->
  </div>

    </swiper>
</template>

<script>
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

import StartPage from './StartPage';
import GameOpen from './GameOpen';
import GameClosed from './GameClosed';
import GameEnd from './GameEnd';
import { MovesToIndex, IndexToMoves, GameGuardian, GameState, GameStateIndex, Network } from '../constants';
import { UserRaidenApi, GuardianApi } from '../utils';

Vue.use(VueAwesomeSwiper);

const web3Utils = require('web3-utils');


export default {
    props: ['userInfo'],
    components: {
        StartPage,
        GameOpen,
        GameClosed,
        GameEnd,
    },
    data() {
        return {
            swiperOptions: {
                noSwiping: true,
                navigation: {
                    nextEl: '.next',
                    prevEl: '.prev',
                },
                noSwipingClass: "no-swipe",
                loop: false,
                slidesPerView: "auto",
            },
            userRaidenApi: null,
            guardianApi: new GuardianApi(
                Vue.axios,
                GameGuardian.host,
            ),
            player: null,
            game: null,
            gameState: GameState.null,
            move: null,
            timer: {intervalGame: 0, intervalResolve: 0, value: 0},
            raiden_payment: null,
            winningPayment: null,
            moveStarted: null,
            secret: null,
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        },
    },
    watch: {
        userInfo() {
            this.setUserRaidenApi();
        },
    },
    mounted() {
        this.setUserRaidenApi();
    },
    methods: {
        setUserRaidenApi() {
            this.userRaidenApi = new UserRaidenApi(
                Vue.axios,
                this.userInfo.ip,
                GameGuardian.token_address[Network],
                GameGuardian.raiden_address[Network]
            );
        },
        restartGame() {
            this.swiper.slideTo(0, 1000, false);
        },
        nextSlide() {
            if (this.swiper.realIndex == 0) {
                console.log('this.userInfo', this.userInfo);
                this.game = null;
                this.raiden_payment = null;
                this.winningPayment = null;
                this.player = null;
                this.move = null;
                this.moveStarted = null;
                this.secret = null;
                if (!this.userInfo.address || !this.userInfo.ip) {
                    this.$emit('needs-info');
                    return;
                }
                this.setCurrentGame().then(() => {
                    if (this.gameState == GameState.resolved) {
                        console.log('gameState resolved, starting new game');
                        return this.startGame();
                    }
                    return;
                }).then(() => {
                    return this.setCurrentGame();
                }).then(() => {
                    if (this.gameState == GameState.closed) {
                        alert(`wait for results on previous game: ${Math.floor(this.wait / 1000)} sec`);
                    } else {
                        this.swiper.slideNext(1000, false);
                    }
                });
            } else {
                this.swiper.slideNext(1000, false);
            }
        },
        userPlay() {
            let self = this;
            if (!this.player || !this.move) {
                alert('Choose a player and a move.');
            }

            async function play() {
                if (!self.paymentIdentifier) {
                    await self.initMove();
                }
                if (!self.paymentIdentifier) {
                    throw new Error('Payment identifier not received.')
                }
                self.userRaidenApi.pay({
                    amount: GameGuardian.amount,
                    identifier: self.paymentIdentifier,
                }).then((response) => {
                    console.log('raiden payment response', response);
                    self.paymentIdentifier = null;
                    self.raiden_payment = response.data;
                    self.nextSlide();
                }).catch((error) => {
                    alert(`${error} on ${self.userRaidenApi.ip}`);
                });
            };
            play();
        },
        initMove() {
            return this.guardianApi.initMove(this.game._id, {
                playerId: String(this.player),
                userAddress: this.userInfo.address,
                moveHash: this.getMoveHash(),
            }).catch((error) => {
                alert(`${error} on ${this.guardianApi.ip}`);
            }).then((response) => {
                this.moveStarted = response.data;
                this.paymentIdentifier = response.data.paymentIdentifier;
            });
        },
        setPlayer(index) {
            this.player = index;
            console.log('this.player', this.player);
        },
        setMove(index) {
            this.move = index;
            console.log('this.move', this.move);
        },
        getSecret() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },
        getMoveHash() {
            const secret = this.getSecret();

            if (!this.player) throw new Error('Cannot send move. No player was chosen.');
            if (!this.move) throw new Error('Cannot send move. No move was chosen.');
            if (!this.game._id) throw new Error('Cannot send move. No game._id.');
            if (!secret) throw new Error('Cannot send move. No secret was chosen.');
            this.secret = secret;
            return web3Utils.soliditySha3(this.userInfo.address, this.game._id, this.player, IndexToMoves[this.move], GameGuardian.amount, secret);
        },
        setCurrentGame() {
            return this.guardianApi.getGame().then((response) => {
                let deltaTime;
                const game = response.data[0];
                this.game = game;

                deltaTime = new Date().getTime() - new Date(game.startTime).getTime();
                this.timer.intervalGame = game.gameTime;
                this.timer.intervalResolve = game.gameTime + game.resolveTime;
                this.timer.value = new Date(game.startTime).getTime();

                console.log('setCurrentGame', game);
                console.log('this.timer', this.timer);

                if (deltaTime < game.gameTime) {
                    // We are during game time, users can make moves
                    this.gameState = GameState.open;
                } else if (deltaTime < (game.gameTime + game.resolveTime)) {
                    // We are during the game resolution time, users wait for results and payments
                    this.gameState = GameState.closed;
                    this.wait = this.timer.intervalResolve - deltaTime;
                    console.log('wait', this.wait);
                } else {
                    // Game and resolution has ended.
                    // We query for a new game
                    // setTimeout(this.setCurrentGame, 2000);
                    this.gameState = GameState.resolved;
                }
                console.log('gameState', GameStateIndex[this.gameState]);
            });
        },
        startGame() {
            return this.guardianApi.startGame();
        },
        gameTimerEnd() {
            console.log('gameTimerEnd');
            // If a move was sent go to the next step
            // Go back to start if the game was not played
            if (!this.raiden_payment) {
                this.swiper.slideTo(0, 1000, false);
            } else {
                // Just in case the next step slide did not work after the payment was made
                if (this.swiper.realIndex == 1) {
                    this.swiper.slideNext(1000, false);
                }
                // Send the move data to the guardian server
                this.guardianApi.revealMove(this.moveStarted._id, {
                    move: IndexToMoves[this.move],
                    secret: this.secret,
                    amount: GameGuardian.amount,
                }).then((response) => {
                    console.log('revealMove', response);
                }).catch(alert);
            }
        },
        resolveTimerEnd() {
            console.log('resolveTimerEnd');
            // get winning move from the server and show it in GameClosed
            // (remove next game timer from last page; maybe have one on the first page)
            this.guardianApi.revealGame(this.game._id)
                .then((response) => {
                    let game = response.data;
                    if (!game) throw new Error(`Game not found ${this.game._id}`);
                    if (game.inProgress || !game.winningMove) {
                        setTimeout(this.resolveTimerEnd, 2000);
                        return;
                    }
                    this.game = game;
                    this.getWinningPayment().then(() => {
                        // Do one retry in 4 sec.
                        if (!this.winningPayment) {
                            setTimeout(() => {
                                console.log('Retrying getWinningPayment');
                                this.getWinningPayment().then(() => {
                                    if (!this.winningPayment) {
                                        this.winningPayment = 'Could not find Raiden payment.';
                                    }
                                })
                            }, 4000);
                        }
                    });
                }).catch(alert);
        },
        getWinningPayment() {
            return this.userRaidenApi.payments().then((response) => {
                let payments = response.data.filter((payment) => {
                    return payment.initiator === GameGuardian.raiden_address[Network];
                });
                console.log('payments', payments);
                const lastPaymentReceived = payments.pop();
                console.log('lastPaymentReceived', lastPaymentReceived);
                console.log('this.raiden_payment', this.raiden_payment);
                if (lastPaymentReceived && lastPaymentReceived.identifier === this.raiden_payment.identifier) {
                    this.winningPayment = lastPaymentReceived;
                    console.log('winningPayment set');
                }
            });
        },
    }
}
</script>

<style>
html, body {
    margin: 0;
}
.margin {
    margin: auto;
    padding-bottom: 10px;
}
.menu{
    position:fixed!important;
    top:3px!important;
}
.menu.help {
    right: 3px!important;
}

.swiper-margin {
    margin: 0;
}
.swiper-container {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}
.swiper-slide {
    width: 100%!important;
}
/* .swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
    width: 70%!important;
}
.swiper-slide:nth-child(3n), .swiper-slide:nth-child(5n) {
    width: 30%!important;
    overflow-y: scroll;
} */
.fullheight, .v-window, .v-window__container {
    height: 100%;
}
.v-tabs__items {
    height: 100%;
}

.nav{
    position:fixed!important;
    top:3px!important;
}
.nav.prev {
    left: 163px!important;
}
.nav.next {
    right: 163px!important;
}
</style>

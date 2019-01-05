<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <v-container>
                    <StartPage v-on:go="tryGoToOpenState()"/>
            </v-container>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <v-layout text-xs-center wrap>
                <v-flex xs12>
                    <GameOpen
                        v-if="game"
                        :timer="timer"
                        :player="player"
                        :move="move"
                        :players1="players1"
                        :players2="players2"
                        :gameGuardianAmount="gameGuardianAmount"
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
                :raiden_payment="raiden_payment"
                :winningPayment="winningPayment"
                v-on:timer-end="resolveTimerEnd"
                v-on:restart-game="restartGame()"
            />
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <v-layout text-xs-center wrap fullheight>
                <v-flex xs8>
                    <RobotLive
                        v-if="game"
                        :stream="stream"
                    />
                    <!-- <RobotLive
                        v-if="game"
                        :stream="stream + (gameRevealed ? '&muted=false' : '&muted=true')"
                    /> -->
                </v-flex>
                <v-flex xs4>
                    <GameClosed
                        v-if="game"
                        :game="game"
                        :player="player"
                        :move="move"
                        :winningPayment="winningPayment"
                        v-on:restart-game="restartGame()"
                    />
                </v-flex>
            </v-layout>
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
    </swiper>
</template>

<script>
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

import StartPage from './StartPage';
import GameOpen from './GameOpen';
import GameClosed from './GameClosed';
import RobotLive from './RobotLive';
import { IndexToMoves, GameGuardian, GameState, GameStateIndex, Network } from '../constants';
import { UserRaidenApi } from '../utils';

Vue.use(VueAwesomeSwiper);

const web3Utils = require('web3-utils');

export default {
    props: ['userInfo', 'guardianApi', 'gameGuardianAmount'],
    components: {
        StartPage,
        GameOpen,
        GameClosed,
        RobotLive,
    },
    data() {
        let data = {
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
            GameState,
            stream: GameGuardian.stream,
            timer: {intervalGame: 0, intervalResolve: 0, value: 0},
        }
        this.resetGameData(data);
        return data;
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
        game() {
            if (this.game && this.game.winningMove) {
                this.goToResolvedState();
            }
        },
    },
    mounted() {
        this.setUserRaidenApi();
    },
    methods: {
        resetGameData(self) {
            self.game = null;
            self.raiden_payment = null;
            self.winningPayment = null;
            self.player = null;
            self.move = null;
            self.moveStarted = null;
            self.secret = null;
            self.players1 = 0;
            self.players2 = 0;
            self.gameRevealed = false;
        },
        setUserRaidenApi() {
            if (!this.userInfo.ip) return;
            this.userRaidenApi = new UserRaidenApi(
                Vue.axios,
                this.userInfo.ip,
                GameGuardian.token_address[Network],
                GameGuardian.raiden_address[Network]
            );
            this.userRaidenApi.address().then(response => {
                if (!response.data)
                    throw new Error('Could not get your Raiden node Ethereum address');
                this.userInfo.address = response.data.our_address;
            }).catch((error) => {
                alert(`${error} on ${this.userRaidenApi.ip}. Make sure your Raiden node's --rpccorsdomain is set correctly.`);
            });
        },
        restartGame() {
            this.swiper.slideTo(0, 1000, false);
        },
        goToOpenState() {
            this.swiper.slideTo(GameState.open, 1000, false);
            this.setPlayersMoveCount();
        },
        goToCloseState() {
            this.swiper.slideTo(GameState.closed, 1000, false);
        },
        goToResolvedState() {
            this.swiper.slideTo(GameState.resolved, 1000, false);
        },
        setPlayersMoveCount() {
            let intervalID = setInterval(() => {
                if (this.swiper.realIndex != GameState.open) {
                    clearInterval(intervalID);
                    return;
                }
                this.guardianApi.getGameMoveCount(this.game._id, 1).then((response) => {
                    this.players1 = response.data.count;
                });
                this.guardianApi.getGameMoveCount(this.game._id, 2).then((response) => {
                    this.players2 = response.data.count;
                });
            }, 3000);
        },
        tryGoToOpenState() {
            console.log('this.userInfo', this.userInfo);
            this.resetGameData(this);
            if (!this.userInfo.address || !this.userInfo.ip) {
                this.$emit('needs-info');
                return;
            }
            this.setCurrentGame().then(({ game, gameState, wait }) => {
                if (gameState == GameState.resolved) {
                    console.log('gameState resolved, starting new game');
                    return this.startGame();
                }
                return;
            }).then(() => {
                return this.setCurrentGame();
            }).then(({ game, gameState, wait }) => {
                if (gameState == GameState.closed) {
                    alert(`wait for results on previous game: ${Math.floor(wait / 1000)} sec`);
                } else {
                    this.goToOpenState();
                }
            });
        },
        userPlay() {
            let self = this;
            if (!this.player || !this.move) {
                alert('Choose a player and a move.');
                return;
            }

            async function play() {
                if (!self.paymentIdentifier) {
                    await self.initMove();
                }
                if (!self.paymentIdentifier) {
                    throw new Error('Payment identifier not received.');
                }
                if (self.raiden_payment) {
                    console.log('Raiden payment already sent.');
                    return;
                }
                self.userRaidenApi.pay({
                    amount: self.gameGuardianAmount,
                    identifier: self.paymentIdentifier,
                }).then((response) => {
                    console.log('raiden payment response', response);
                    self.paymentIdentifier = null;
                    self.raiden_payment = response.data;
                    self.goToCloseState();
                }).catch((error) => {
                    alert(`${error} on ${self.userRaidenApi.ip}`);
                });
            }
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
            return web3Utils.soliditySha3(this.userInfo.address, this.game._id, this.player, IndexToMoves[this.move], this.gameGuardianAmount, secret);
        },
        setCurrentGame() {
            return this.guardianApi.getGame().then((response) => {
                let deltaTime, gameState, wait, intervalResolve;
                const game = response.data[0];

                deltaTime = new Date().getTime() - new Date(game.startTime).getTime();
                intervalResolve = game.gameTime + game.resolveTime;

                console.log('setCurrentGame', game);
                console.log('this.timer', this.timer);

                if (deltaTime < game.gameTime) {
                    gameState = GameState.open;
                } else if (deltaTime < (game.gameTime + game.resolveTime)) {
                    gameState = GameState.closed;
                } else {
                    gameState = GameState.resolved;
                }

                if (gameState == GameState.open) {
                    this.game = game;
                    this.timer.intervalGame = game.gameTime;
                    this.timer.intervalResolve = intervalResolve;
                    this.timer.value = new Date(game.startTime).getTime();
                    console.log('gameState', GameStateIndex[gameState]);
                }
                wait = intervalResolve - deltaTime;
                return { game, gameState, wait };

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
                this.restartGame();
                alert('Your off-chain payment was not sent to the guardian. Please check your Raiden node.')
            } else {
                // Just in case the next step slide did not work after the payment was made
                if (this.swiper.realIndex == GameState.open) {
                    this.goToCloseState();
                }
                // Send the move data to the guardian server
                this.guardianApi.revealMove(this.moveStarted._id, {
                    move: IndexToMoves[this.move],
                    secret: this.secret,
                    amount: this.gameGuardianAmount,
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
                    this.gameRevealed = true;

                    if (IndexToMoves[this.move] === game.winningMove) {
                        this.tryGetWinningPayment();
                    } else {
                        this.winningPayment = 'You lost.';
                    }
                }).catch(alert);
        },
        tryGetWinningPayment() {
            let repeatTimes = 0;
            let intervalID = setInterval(() => {
                repeatTimes ++;
                if (!this.winningPayment) {
                    if (repeatTimes < 20) {
                        console.log('Trying to find winning Raiden payment from CyryptoWarsGuardian');
                        this.getWinningPayment();
                    } else {
                        this.winningPayment = 'Could not find Raiden payment.';
                        clearInterval(intervalID);
                    }
                } else {
                    clearInterval(intervalID);
                }
            }, 2000);
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
                if (
                    lastPaymentReceived &&
                    this.raiden_payment &&
                    lastPaymentReceived.identifier === this.raiden_payment.identifier
                ) {
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

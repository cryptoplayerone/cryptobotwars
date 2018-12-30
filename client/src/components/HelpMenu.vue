<template>
    <v-dialog ref="myDialog"
        v-model="dialog"
        width="500"
        persistent
    >
        <v-btn absolute small top right fab
            class="menu help"
            slot="activator"
        >
            <v-icon>fa-question</v-icon>
        </v-btn>

        <v-card>
            <v-card-title
                class="headline grey lighten-2"
                primary-title
            >
                Rock-Paper-Scissors on Raiden Network
            </v-card-title>

            <v-card-text>
                <p class="display-1">About</p>
                <a href="https://github.com/cryptoplayerone/cryptobotwars" target="_blank">Github</a>
                <p>Can be played by an unlimited number of simultaneous users, who choose between the game's two players. There is only 1 game playing at any point in time. You might have to wait for the current game to conclude before being able to play.</p>
                <p>You choose a player and a move (rock, paper or scissors). The Game Client (web app) sends your encrypted move data to the Game Guardian, and triggers an off-chain payment of <span class="font-weight-black">{{parseFloat(gameAddresses.amount / 10**18).toFixed(18)}} WETH</span> on your behalf, from your Raiden node to the Game Guardian address: <a :href="'https://etherscan.io/address/' + gameAddresses.guardian" target="_blank"><span class="font-weight-black">{{gameAddresses.guardian}}</span></a>.</p>
                <p>The game uses the following token: <a :href="'https://etherscan.io/address/' + gameAddresses.token" target="_blank"><span class="font-weight-black">{{gameAddresses.token}}</span></a>.</p>

                <p>After the game round ends, the web app sends the actual move data. The Game Guardian then choses each player's move based on how the majority voted and choses the winning move & player based on the known rock-paper-scissors rules. It calculates how many tokens it has received for the game, keeps 10% (Robots also want crypto) and then distributes the rest to all players that sent the winning move & player.</p>
                <p>At the end, <span class="font-weight-black black" > Dark Vader</span> & <span class="font-weight-black blue"> Blue Yoda</span> will act out the duel for you in a live stream (make sure your sound is on). If the live stream is not available, it means they are tired and need to sleepzzz.</p>

                <p class="display-1">How to play</p>
                <p>To play the game, you need to run a Raiden node on Mainnet. It only works with the <a href="https://github.com/raiden-network/raiden/releases/tag/v0.100.1" target="_blank">Red Eyes release</a>. Check out the <a href="https://raiden-network.readthedocs.io/en/stable/" target="_blank">Raiden Installation Guide</a> for details.</p>

                <p>You need to set the <span class="font-weight-black">--rpccorsdomain</span> flag to the game's domain.</p>
                <p class="red">This <span class="font-weight-black">will</span> give access to the game to make payments <span class="font-weight-black">on your behalf</span> when choosing a move. Do not deposit more tokens than you are willing to lose.</p>

                <p>Example:</p>
                <v-textarea
                    solo
                    name="input-7-1"
                    value='raiden-v0.100.1 --accept-disclaimer --eth-rpc-endpoint https://mainnet.infura.io/v3/[YOUR_TOKEN] --keystore-path ~/Library/Ethereum/keystore --rpc --rpccorsdomain http://127.0.0.1:*/*,http://cryptoplayer.one:*/* --api-address http://127.0.0.1:5001 --address [YOUR_ETHEREUM_ADDRESS]'
                ></v-textarea>

                <p class="display-1">Settings</p>
                <p>To play the game, you need to provide your Raiden node <span class="font-weight-black">--api-address</span>.</p>
                <v-form v-model="valid">
                    <v-text-field
                        v-model="ip"
                        :rules="ipRules"
                        label="Raiden public API RPC server"
                        placeholder="127.0.0.1:5001"
                        :value="userInfo.ip"
                        :append-icon="ip ? `check` : ``"
                        required
                    ></v-text-field>
                </v-form>
                </br>
                <p class="display-1">Disclaimer</p>
                <p>This is experimental software running on the Mainnet. Use it at your own risk if you want to give a hand at testing the game and the Bug Bounty Raiden Network release.</p>
                <p>This project is built on top of Raiden Network, but it is an effort external to the Raiden Network project. Any issues encountered with the game should be directed to our <a href="https://github.com/cryptoplayerone/cryptobotwars/issues" target="_blank">Github Issue Tracker</a>.</p>
                <p>Any issues encountered with Raiden, should be directed to the Raiden project.</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    flat
                    @click="closeDialog()"
                >
                    I accept
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['infoRequired', 'userInfo', 'gameAddresses'],
    data() {
        return {
            dialog: false,
            valid: false,
            ip: '',
            ipRules: [
                v => !!v || 'IP is required',
                v => /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/.test(v) || 'IP must be valid'
            ]
        }
    },
    mounted() {
        this.ip = '127.0.0.1:5001';
    },
    watch: {
        infoRequired() {
            if (this.infoRequired) {
                this.dialog = true;
            }
        },
    },
    methods: {
        closeDialog() {
            if(this.ip) {
                this.dialog = false;
                this.$emit('set-info', {
                    ip: `http://${this.ip}`,
                });
            }
        },
    }
}
</script>

<template>
    <v-dialog ref="myDialog"
        v-model="dialog"
        width="500"
        persistent
    >
        <v-btn absolute small top right fab
            color="white"
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
                <p>You choose a player and a move (rock, paper or scissors). The web app sends your move data (hashed) to the Game Guardian, and triggers an off-chain payment with your Raiden node to the Game Guardian address.</p>

                <p>After the game round ends, the web app sends the actual move data. The Game Guardian then calculates how many tokens it has received for the round, keeps 10% and then distributes the rest to all players that sent the winning move.</p>

                <p class="display-1">How to play</p>
                <p>To play the game, you need to run a Raiden node on Kovan. Check out <a href="https://raiden-network.readthedocs.io/en/stable/" target="_blank">https://raiden-network.readthedocs.io/en/stable/</a> for details.</p>

                <p>You need to set the "--rpccorsdomain" flag to the game's domain. This will give access to the game to make payments on your behalf when choosing a move.</p>

                <p>Example:</p>
                <v-textarea
                    solo
                    name="input-7-1"
                    value='raiden --network-id kovan --environment-type development --accept-disclaimer --gas-price 20000000000  --eth-rpc-endpoint "https://ropsten.infura.io/v3/<YOUR_TOKEN>" --log-config "raiden:debug" --keystore-path ~/Library/Ethereum/kovan/keystore --rpccorsdomain http://127.0.0.1:8080,http://localhost:*/* --api-address http://127.0.0.1:5001'
                ></v-textarea>

                <p class="display-1">Settings</p>
                <p>To play the game, you need to provide your Raiden node info.</p>
                <v-form v-model="valid">
                    <v-text-field
                        v-model="address"
                        :rules="addressRules"
                        :counter="42"
                        label="Raiden node Ethereum address"
                        placeholder="0x0000000000000000000000000000000000000000"
                        :value="userInfo.address"
                        v-on:change="updateInfo()"
                        :append-icon="address ? `check` : ``"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="ip"
                        :rules="ipRules"
                        label="Raiden public API RPC server"
                        placeholder="127.0.0.1:5001"
                        :value="userInfo.ip"
                        v-on:change="updateInfo()"
                        :append-icon="ip ? `check` : ``"
                        required
                    ></v-text-field>
                </v-form>
                </br>
                <p class="display-1">Disclaimer</p>
                <p>This is experimental software, use it at your own risk. Only available on Ropsten.</p>
                <p>This project is built on top of Raiden Network, but it is an effort external to the Raiden Network project.</p>
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
    props: ['infoRequired', 'userInfo'],
    data() {
        return {
            dialog: false,
            valid: false,
            address: '',
            addressRules: [
                v => !!v || 'Address is required',
                v => v.length === 42 || 'Address must be 42 characters'
            ],
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
            if(this.address && this.ip) {
                this.dialog = false;
            }
        },
        updateInfo() {
            if(this.address && this.ip) {
                this.$emit('set-info', {
                    address: this.address,
                    ip: `http://${this.ip}`,
                });
            }
        }
    }
}
</script>

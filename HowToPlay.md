# Rock-Paper-Scissors on Raiden Network

## About

Can be played by an **unlimited number of simultaneous users**, who choose between the game's two players.

There is only 1 game playing at any point in time. You might have to **wait** for the current game to conclude before being able to play.

You choose a player and a move (rock, paper or scissors). The Game Client (web app) sends your encrypted move data to the Game Guardian, and triggers an off-chain payment on your behalf, from your Raiden node to the [Game Guardian address](https://etherscan.io/address/0xFeA60432EEb8E858364E0f8953F1386e853A7804)
The game uses [WETH token](https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2).

After the game round ends, the web app sends the actual move data. The Game Guardian then choses each player's move based on how the majority voted and choses the winning move & player based on the known rock-paper-scissors rules. It calculates how many tokens it has received for the game, keeps 10% (Robots also want crypto) and then distributes the rest to all players that sent the winning move & player.

At the end, **Dark Vader** & **Blue Yoda** will act out the duel for you in a live stream (make sure your sound is on). If the live stream is not available, it means they are tired and need to sleepzzz.

## How to play
To play the game, you need to run a Raiden node on Mainnet. It only works with the [Red Eyes release](https://github.com/raiden-network/raiden/releases/tag/v0.100.1). Check out the [Raiden Installation Guide](https://raiden-network.readthedocs.io/en/stable/) for details.

**To be able to receive rewards, you need to make sure you have a path from the Game Guardian Ethereum address (Raiden node) to your node, that has enough deposits in the rewards direction.**

**You may need to ask other nodes to open a channel with you and make a deposit, you can ask for help in [our chat](https://riot.im/app/#/room/#cryptowars:matrix.org).**
You can also use the [Raiden Network Explorer](https://explorer.raiden.network/tokens/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) to see if you have a path with bidirectional deposits, to be able to both **send** and **receive** payments.

When running Raiden, you need to set the `--rpccorsdomain` flag to the game's domain.
This **will** give access to the game to make payments **on your behalf** when choosing a move. **Do not deposit more tokens than you are willing to lose.**

```
raiden-v0.100.1 --accept-disclaimer --eth-rpc-endpoint https://mainnet.infura.io/v3/[YOUR_TOKEN] --keystore-path ~/Library/Ethereum/keystore --rpc --rpccorsdomain http://127.0.0.1:*/*,https://cryptoplayer.one:*/* --api-address http://127.0.0.1:5001 --address [YOUR_ETHEREUM_ADDRESS]
```

You may benefit from using a process manager with `autorestart`, in order to keep your Raiden node online. You can try out https://github.com/Supervisor/supervisor, https://github.com/foreverjs/forever or another tool that you like.

### Example of running your Raiden node with `forever`

```sh
touch raiden.sh
vi raiden.sh
```
Then copy the following content into `raiden.sh`, changing it after your needs: (it only works with absolute paths)

```
#!/bin/sh
exec /Users/user/raiden/raiden-v0.100.1 --accept-disclaimer --eth-rpc-endpoint https://mainnet.infura.io/v3/[YOUR_TOKEN] --keystore-path /Users/user/Library/Ethereum/keystore --rpc --rpccorsdomain http://localhost:*/*,http://127.0.0.1:*/*,https://cryptoplayer.one:*/* --api-address http://127.0.0.1:5001 --address [YOUR_ETHEREUM_ADDRESS] --password-file /Users/user/password.txt
```
Then run the above script with `forever`:
```
forever start --minUptime 10000 --spinSleepTime 5000 -d -c /bin/bash raiden.sh
```

## Settings

To play the game, you need to provide your Raiden node `--api-address` in the `?` Help Menu (e.g. `127.0.0.1:5001`).

## Disclaimer

This is experimental software running on the Mainnet. Use it at your own risk if you want to give a hand at testing the game and the Red Eyes, Bug Bounty Raiden Network release.

This project is built on top of Raiden Network, but it is an effort external to the Raiden Network project. Any issues encountered with the game should be directed to our [Github Issue Tracker](https://github.com/cryptoplayerone/cryptobotwars/issues)
Any issues encountered with Raiden, should be directed to the Raiden project.

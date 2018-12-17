export const GameState = {
    null: 0,
    open: 1,
    closed: 2,
    resolved: 3,
}

export const GameStateIndex = {
    0: 'null',
    1: 'open',
    2: 'closed',
    3: 'resolved',
}

export const PlayerToIndex = {
    vader: 1,
    yoda: 2,
}

export const IndexToPlayer = {
    1: 'vader',
    2: 'yoda',
}

export const MovesToIndex = {
    rock: 1,
    paper: 2,
    scissors: 3,
}

export const IndexToMoves = {
    1: 'rock',
    2: 'paper',
    3: 'scissors',
}

export const GameGuardian = {
    host: process.env.VUE_APP_GUARDIAN_HOST,
    raiden_address: {
        3: process.env.VUE_APP_GUARDIAN_RAIDEN_ADDRESS_ROPSTEN,
        42: process.env.VUE_APP_GUARDIAN_RAIDEN_ADDRESS_KOVAN,
    },
    token_address: {
        3: process.env.VUE_APP_GUARDIAN_TOKEN_ADDRESS_ROPSTEN,
        42: process.env.VUE_APP_GUARDIAN_TOKEN_ADDRESS_KOVAN,
    },
    amount: 100000,
}

export const Network = process.env.VUE_APP_NETWORK;

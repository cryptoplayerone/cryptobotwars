interface RPSW {
    [key:string]: string;
}

export const RockPaperScissorsGetLoser: RPSW = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
}

export const RockPaperScissorsGetWinner: RPSW = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock',
}

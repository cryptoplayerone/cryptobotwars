export class UserRaidenApi {
    constructor(axios, ip, token, target) {
        this.axios = axios;
        this.ip = ip;
        this.token = token;
        this.target = target;
    }

    pay(payload) {
        const api = `${this.ip}/api/1/payments/${this.token}/${this.target}`;
        console.log('pay', api, payload);
        return this.axios.post(api, payload);
    }

    history(fromBlock=0) {
        const api =  `${this.ip}/api/1/events/channels/${this.token}/${this.target}?from_block=${fromBlock}`;
        console.log('history', api);
        return this.axios.get(api);
    }

    payments() {
        const api = `${this.ip}/api/1/payments/${this.token}`;
        return this.axios.get(api);
    }
}

export class GuardianApi {
    constructor(axios, ip) {
        this.axios = axios;
        this.ip = ip;
    }

    getGame() {
        const api = `${this.ip}/game?filter={"offset":0,"limit":1,"skip":0,"order":"startTime%20DESC"}`;
        return this.axios.get(api);
    }

    startGame() {
        const api = `${this.ip}/game`;
        return this.axios.post(api, {});
    }

    revealGame(gameid) {
        const api = `${this.ip}/game/${gameid}`;
        return this.axios.get(api, {});
    }

    initMove(gameid, move) {
        const api = `${this.ip}/game/${gameid}/move`;
        return this.axios.post(api, move);
    }

    revealMove(moveid, move) {
        const api = `${this.ip}/move/${moveid}`;
        return this.axios.patch(api, move);
    }
}

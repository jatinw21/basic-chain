export default class Miner {
    constructor(bc, tp, wallet, p2pServer) {
        this.bc = bc
        this.tp = tp
        this.wallet = wallet
        this.p2pServer = p2pServer
    }

    mine() {
        const validTransactions = this.tp.validTransactions();

        // reward for miner

        // create a block consisting of valid transactions

        // sync chains

        // clear tp local and then broadcast to clear theirs
        
        // NOTE: In real one, this could lead to someone malicious 
        // clearing honest transactions. So, some meansures
        // would be taking place for when to remove the transactions
}
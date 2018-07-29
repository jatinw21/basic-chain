import Transaction from "../wallet/transaction";
import Wallet from '../wallet'

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
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))

        // create a block consisting of valid transactions
        const block = this.bc.addBlock(validTransactions)

        // sync chains
        this.p2pServer.syncChains()

        // clear tp local and then broadcast to clear theirs
        this.tp.clear()
        this.p2pServer.broadcastClearTransactions()


        // NOTE: In real one, this could lead to someone malicious 
        // clearing honest transactions. So, some meansures
        // would be taking place for when to remove the transactions

        return block
}
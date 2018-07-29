import ChainUtil from '../chain-util'
import { INITIAL_BALANCE } from '../config'
import Transaction from './transaction';
import { start } from 'repl';

export default class Wallet {
    constructor() {
        // Initial balance for an actual cryptocurrency is zero
        // but here giving balance to enable transactions
        this.balance = INITIAL_BALANCE;

        // REVIEW: private key can be obtained from here. 
        // Is this secure from others?
        this.keypair = ChainUtil.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    toString() {
        // For private key: ${this.keypair.priv.toString('hex') or without hex
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance  : ${this.balance}`
    }

    sign(dataHash) {
        return this.keypair.sign(dataHash)
    }

    // generate + update or add in transaction pool
    createTransaction(recipient, amount, bc, tp) {
        this.balance = this.calculateBalance(bc)
        // cannot send more than balance
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the current balance: ${balance}`)
            return
        }

        // check if transaction already exists by checking if 
        // there is a transaction whose sender is this wallet
        let transaction = tp.existingTransaction(this.publicKey);
        
        if (transaction) {
            // exists, so update to add this transaction to output too

            // How does it update it inside the transactionPool?
            // Since, in transactionPool there is an array of references to the transaction objects
            // updating the transaction means transactionPool has the new value available too.
            transaction.update(this, recipient, amount)
        } else {
            // doesnt exist, so create a new transaction and add to pool
            transaction = Transaction.newTransaction(this, recipient, amount)
            tp.updateOrAddTransaction(transaction)
        }

        return transaction
    }

    // NOTE: REVIEW: TODO: inefficient - better way is to just store the timestamp in the wallet for last transaction related 
    // to this wallet

    // The balance calculation assumes transactions are mined right away.
    // Here's a bug that can easily happen:
    // - A sends 25 to B, then B sends 25 to A, then C mines transactions(so there are 2 transactions in transaction pool)
    // This will show improper balance for B because it won't count the transfer from A which occurred before B's Input Transaction was created.
    // In the end, A and B should both have 500(what they started with) and C should have 550(his mining reward).But in reality, it will show A as having 500, B with balance 475 and C with 550. 
    // B's balance calculation didn't take into account A's transfer which occurred before B's Input Transaction was created.

    // I fixed the Wallet balance calculation bug by completely re-coding the balance calculation as follows:
    // - each wallet stores the timestamp of the last block it used to calculate the balance last time - this way, there's no need to check all blocks from the beginning of the blockchain on every balance calculation (which is highly inneficient, especially as the blockchain gets longer)
    // - only checks new blocks that were mined (added) since last time balance was calculated
    // - divides up transactions into those that transferred money TO this wallet and FROM this wallet - this way it's easy to iterate over each list and add/subtract, respectively
    // - Sets the balance of this wallet after calculating it, so won't have to re-calculate next time if blockchain hasn't changed - will be super quick
    calculateBalance(blockchain) {
        let balance = this.balance
        let transactions = []

        // entire history of transactions
        blockchain.chain.forEach(block => block.data.forEach(t => transactions.push(t)))

        // transaction that were created by this specific wallet
        const walletInputTs = transactions.filter(t => t.input.address === this.publicKey)

        let startTime = 0

        // want to get most recent transaction this wallet created
        if (walletInputTs.length > 0){
            const recentInputT = walletInputTs.reduce((prev, curr) =>
                prev.input.timestamp > curr.input.timestamp ? prev : curr
            )

            // set balance and time to most recent transaction by this wallet
            // later add up all places where it was in outputs
            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount
            startTime = recentInputT.input.timestamp
        }    

        transactions.forEach(t => {
            if (t.input.timestamp > startTime) {
                t.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount
                    }
                })
            }
        })

        return balance

    }

    static blockchainWallet() {
        const blockchainWallet = new this()
        blockchainWallet.address = 'blockchain-wallet'
        return blockchainWallet
    }
}
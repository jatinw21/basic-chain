import ChainUtil from '../chain-util'
import { INITIAL_BALANCE } from '../config'
import Transaction from './transaction';

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
    createTransaction(recipient, amount, tp) {
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

    static blockchainWallet() {
        const blockchainWallet = new this()
        blockchainWallet.address = 'blockchain-wallet'
        return blockchainWallet
    }
}
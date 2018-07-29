import ChainUtil from '../chain-util'
import { MINING_REWARD } from '../config'

export default class Transaction {
    constructor() {
        this.id = ChainUtil.id()
        this.input = null
        this.outputs = []
    }

    update(senderWallet, recipient, amount) {
        // find the output which refers to the sender one, so that it can be updated
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey)
        
        // again check if try to spend exceeding
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return
        }

        // update the new amount that should be left in sender's wallet
        senderOutput.amount = senderOutput.amount - amount;

        // add the new transaction
        this.outputs.push({
            amount, //ES6
            address : recipient
        })

        // the previous signature won't be valid anymore, so we need to update that
        Transaction.signTransaction(this, senderWallet)

        return this
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this()
        transaction.outputs.push(...outputs)
        Transaction.signTransaction(transaction, senderWallet)
        return transaction
    }

    // NOTE: this is handled different to btc. Check online for btc process
    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }])
    }

    // cannot give more value to self because there's an if statement checking it
    // cannot make a transaction from another person's wallet because wouldn't have their keypair
    // and so can't sign the transaction with their private key
    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`)
            return
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            {
                // send remainder to self
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                // send to receiver
                amount: amount,
                address: recipient
            }
        ])
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            // REVIEW: Security hole? - sender could just lie here 
            // that balance is more in their implementation
            // and it wouldn't get caught because nowhere is it being checked.
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verfifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }
}
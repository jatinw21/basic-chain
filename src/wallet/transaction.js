import ChainUtil from '../chain-util'

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

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this()

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`)
            return
        }

        transaction.outputs.push(...[
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

        Transaction.signTransaction(transaction, senderWallet)

        return transaction
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
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
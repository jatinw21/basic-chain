import ChainUtil from '../chain-util'

export default class Transaction {
    constructor() {
        this.id = ChainUtil.id()
        this.input = null
        this.outputs = []
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
}
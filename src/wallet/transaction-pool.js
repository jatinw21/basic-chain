import Transaction from './transaction'

export default class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    // outsiders use this function to add transactions
    updateOrAddTransaction(transaction) {
        // if transaction already exists in the pool, then update it
        let transactionWithId = this.transactions.find(t => t.id === transaction.id)
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address)
    }

    validTransactions() {
        // check the amounts equal the balance
        // check that signature is still valid
        return this.transactions.filter(t => {
            const outputTotal = t.outputs.reduce((total, output) => {
                return total + output.amount
            }, 0)

            if (t.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${t.input.address}.`);
                return // skip current transaction
            }

            if (!Transaction.verifyTransaction(t)) {
                console.log(`Invalid signature from ${t.input.address}.`);
                return
            }

            return t
        })
    }
}
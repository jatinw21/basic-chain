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
}
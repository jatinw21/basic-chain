import TransactionPool from '../wallet/transaction-pool'
import Transaction from '../wallet/transaction'
import Wallet from '../wallet'

describe('TransactionPool', () => {
    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'randomAddress', 30)
        tp.updateOrAddTransaction(transaction)
    })

    it('adds transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    })

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction)
        const newTransaction = transaction.update(wallet, 'randomOne', 50)

        // from same wallet so should be updated
        tp.updateOrAddTransaction(newTransaction)
        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction)))
            .not.toEqual(oldTransaction)
    })
})
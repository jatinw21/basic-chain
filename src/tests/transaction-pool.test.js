import TransactionPool from '../wallet/transaction-pool'
import Transaction from '../wallet/transaction'
import Wallet from '../wallet'

describe('TransactionPool', () => {
    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = wallet.createTransaction('randomAddress', 30, tp)
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

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions;

        beforeEach(() => {
            // one transaction already
            validTransactions = [...tp.transactions]
            for (let i = 0; i < 6; i++) {
                wallet = new Wallet()
                transaction = wallet.createTransaction('randomAddr', 30, tp)

                if (i % 2 == 0) {
                    // curropt transaction
                    transaction.input.amount = 9999999
                } else {
                    // correct
                    validTransactions.push(transaction)
                }
                
            }
        })

        it('shows a difference between valid and corrput transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
        })

        it('grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions)
        })
    })
})
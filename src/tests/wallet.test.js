import Wallet from '../wallet'
import TransactionPool from '../wallet/transaction-pool'
import Blockchain from '../blockchain'
import Block from '../blockchain/block';

describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet()
        tp = new TransactionPool()
        bc = new Blockchain()
    })

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50
            recipient = 'randomAddress'
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp)
        })

        describe('and doing the same transaction again', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp)
            })

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2)
            })

            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient).length)
                    .toEqual(2)

                expect(transaction.outputs.filter(output => output.address === recipient)
                    .map(output => output.amount))
                    .toEqual([sendAmount, sendAmount])
            })
        })
    })
})
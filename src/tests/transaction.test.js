import Transaction from '../wallet/transaction'
import Wallet from '../wallet'

describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = 'rcpnt'
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    })

    it('outputs the `amount` subtracted from the wallet balance', () => {

        expect(
            // find the output which belongs to the sender itself 
            // to check whether the amount is subtracted
            transaction.outputs.find(output => output.address === wallet.publicKey).amount
        ).toEqual(wallet.balance - amount)
    })

    it('outputs the `amount` added to recipient', () => {

        expect(
            // find the output which belongs to the recipient itself
            // to check whether the amount is added
            transaction.outputs.find(output => output.address === recipient).amount
        ).toEqual(amount)
    })

    it('inputs the balance of the wallet,', () => {
        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    describe('transacting with amount that exceeds balance', () => {
        beforeEach(() => {
            amount = 50000
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })

        it('does not create transaction', () => {
            expect(transaction).toEqual(undefined)
        })
    })

})
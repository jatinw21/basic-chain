import Transaction from '../wallet/transaction'
import Wallet from '../wallet'
import { MINING_REWARD } from '../config';

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

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    it('invalidates an invalid transaction', () => {
        transaction.outputs[0].amount = 50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
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

    describe('updating a transaction', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20
            nextRecipient = 'nextRecipientAdress'
            transaction = transaction.update(wallet, nextRecipient, nextAmount)
        })

        it('subtracts next amount from sender\'s output.', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount)
        })

        it('ouputs an amount for next recipient.', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount)
        })
    })

    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
        })

        it('rewards the miner\'s wallet', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(MINING_REWARD)
        })
    })
})
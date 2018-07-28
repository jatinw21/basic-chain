import { INITIAL_BALANCE } from '../config'

export default class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keypair = null;
        this.publicKey = null;
    }

    toString() {
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance  : ${this.balance}`
    }
}
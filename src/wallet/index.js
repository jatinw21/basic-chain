import ChainUtil from './chain-util'
import { INITIAL_BALANCE } from '../config'

export default class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keypair = ChainUtil.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance  : ${this.balance}`
    }
}
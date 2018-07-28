import ChainUtil from '../chain-util'
import { INITIAL_BALANCE } from '../config'

export default class Wallet {
    constructor() {
        // Initial balance for an actual cryptocurrency is zero
        // but here giving balance to enable transactions
        this.balance = INITIAL_BALANCE;

        // REVIEW: private key can be obtained from here. 
        // Is this secure from others?
        this.keypair = ChainUtil.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    toString() {
        // For private key: ${this.keypair.priv.toString('hex') or without hex
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance  : ${this.balance}`
    }
}
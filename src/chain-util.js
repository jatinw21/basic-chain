import { ec as EC } from 'elliptic'
import uuidV1 from 'uuid/v1'
import SHA256 from 'crypto-js/sha256'


const ec = new EC('secp256k1')

export default class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }

    // data can be any string, number or entire javascript object
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString()
    }

    static verfifySignature(publicKey, signature, dataHash) {
        // we get the key from public key and we provide 'hex' because that's
        // where the encoding we used to create it initially 
        // using this key object, now we can use the verify method
        // this returns true or false
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature)
    }

    static verifyTransaction(transaction) {
        ChainUtil.verfifySignature(
            transaction.input.address, 
            transaction.input.signature, 
            ChainUtil.hash(transaction.outputs)
        )
    }
}
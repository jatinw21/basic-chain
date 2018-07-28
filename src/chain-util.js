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
}
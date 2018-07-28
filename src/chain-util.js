import { ec as EC } from 'elliptic'
import uuidV1 from 'uuid/v1'

const ec = new EC('secp256k1')

export default class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }
}
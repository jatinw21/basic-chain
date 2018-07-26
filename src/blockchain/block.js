import SHA256 from 'crypto-js/sha256'

const DIFFICULTY = 4

export default class Block {
    constructor(timestamp, lastHash, hash, data, nonce) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString() {
        return `Block Info - 
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Nonce     : ${this.nonce}
            Data      : ${this.data}`
    }

    static genesis() {
        return new this('Genesis Time', '-----', 'f1r5t-h45h', [])
    }

    static mineBlock(lastBlock, data) {
        let timestamp, hash;
        const lastHash = lastBlock.hash;
        let nonce = 0;

        // every miner has to spend some time finding this
        do {
            nonce++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce);
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));
        
        return new this(timestamp, lastHash, hash, data, nonce);
    }

    static hash(timestamp, lastHash, data, nonce) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce } = block
        return Block.hash(timestamp, lastHash, data, nonce)
    }
}
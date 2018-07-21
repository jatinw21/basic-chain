import SHA256 from 'crypto-js/sha256'

export default class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return `Block Info - 
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Data      : ${this.data}`
    }

    static genesis() {
        return new this('Genesis Time', '-----', 'f1r5t-h45h', [])
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new this(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }
}
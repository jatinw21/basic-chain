import ChainUtil from '../chain-util'

import { DIFFICULTY, MINE_RATE } from '../config'

export default class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        return `Block Info - 
            Timestamp  : ${this.timestamp}
            Last Hash  : ${this.lastHash.substring(0,10)}
            Hash       : ${this.hash.substring(0,10)}
            Nonce      : ${this.nonce}
            Difficulty : ${this.difficulty}
            Data       : ${this.data}`
    }

    static genesis() {
        return new this('Genesis Time', '-----', 'f1r5t-h45h', [], 0, DIFFICULTY)
    }

    static mineBlock(lastBlock, data) {
        let timestamp, hash;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        // every miner has to spend some time finding this
        do {
            nonce++;
            timestamp = Date.now();
            // since we're adjusting difficulty based on timestamp of each 
            // block, we'll adjust it in every iteration of loop
            // existing difficulty isn't passed, so it doesn't keep increasing
            // a lot till the time is done and a lot less when it's more
            difficulty = Block.adjustDifficulty(lastBlock,  timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block
        return Block.hash(timestamp, lastHash, data, nonce, difficulty)
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}
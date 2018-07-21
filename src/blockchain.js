import Block from './block';

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const [lastBlock] = a.slice(-1)
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block)
        return block
    }
}
import Block from './block';

export default class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock(data) {
        const [lastBlock] = this.chain.slice(-1)
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block)
        return block
    }

    isValidChain(chain) {
        // in javascript two diff objects with same stuff, if not 
        // referencing to the same object are not equal. So, equality can't be check that way.
        // We can stringify these and compare the string versions
        
        // check if genesis blocks are equal
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        
        for (let i=1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            // check if lastHash is correct and
            // check if current block's hash is correct
            if (block.lastHash !== lastBlock.hash ||
                block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;

    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log("Chain is not longer than current chain.")
            return
        } else if (! this.isValidChain(newChain)) {
            console.log("The received chain is invalid")
            return
        } else {
            console.log("Replacing the current chain with the new received chain")
            this.chain = newChain;
        }
    }
}
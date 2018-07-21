import Blockchain from '../blockchain'
import Block from '../block'

describe('Blockchain', () => {
    let bc;

    beforeEach(() => {
        bc = new Blockchain();
    });

    it('starts with the genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    })

    it('adds a new block', () => {
        const data = 'foo'
        bc.addBlock(data)
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
    })
})
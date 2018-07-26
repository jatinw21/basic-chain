import express from 'express'
import bodyParser from 'body-parser'
import Blockchain from '../blockchain'
import P2PServer from './p2p-server'

const app = express()
const bc = new Blockchain()
const p2pServer = new P2PServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain)    
})

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    // This is the only way to add new blocks right now.
    // And whenever it is added, we want to send the updated bc to every other node
    // So, if this is bigger, everyone will sync to this
    p2pServer.syncChains()

    res.redirect('/blocks')  
})

export default app

// listening for Websocket server
p2pServer.listen()
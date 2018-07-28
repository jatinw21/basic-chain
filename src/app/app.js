import express from 'express'
import bodyParser from 'body-parser'
import Blockchain from '../blockchain'
import P2PServer from './p2p-server'
import Wallet from '../wallet'
import TransactionPool from '../wallet/transaction-pool'

const app = express()
const bc = new Blockchain()
const wallet = new Wallet()
const tp = new TransactionPool()
const p2pServer = new P2PServer(bc, tp)

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

app.get('/transactions', (req, res) => {
    res.json(tp.transactions)
})

app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body
    const transaction = wallet.createTransaction(recipient, amount, tp)

    p2pServer.broadcastTransaction(transaction)
    
    res.redirect('/transactions')
})

export default app

// listening for Websocket server
p2pServer.listen()

// NOTE: Testing stuff here

// for (let i = 0; i < 10; i++) {
//     console.log(bc.addBlock(`foo ${i}`).toString());
// }

// import Wallet from '../wallet'
// const wallet = new Wallet();

// console.log(wallet.toString());

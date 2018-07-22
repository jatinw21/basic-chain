import express from 'express'
import bodyParser from 'body-parser'
import Blockchain from '../blockchain'

const app = express()

const bc = new Blockchain()

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain)    
})

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)
    res.redirect('/blocks')  
})

export default app
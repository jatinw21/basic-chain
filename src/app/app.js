import express from 'express'
import Blockchain from '../blockchain'

const app = express()

const bc = new Blockchain()

app.get('/blocks', (req, res) => {
    res.json(bc.chain)    
})

export default app
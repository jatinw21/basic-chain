import express from 'express'
import Blockchain from '../blockchain'

const app = express()

const bc = new Blockchain()

app.get('/blocks', (req, res) => {
    console.log(req)
    res.json(bc.chain)
})

export default app
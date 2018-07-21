import express from 'express'
const app = express()
app.get('/', (req, res) => {
    res.send({
        message: 'Heelo, World. Hot reloadable!'
    })
})
export default app
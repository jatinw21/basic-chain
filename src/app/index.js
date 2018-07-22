import app from './app'

// We can run multiple instances on one machine, so take port from command line
const HTTP_PORT = process.env.HTTP_PORT || 3002

app.listen(HTTP_PORT, () => { 
    console.log(`Listening on port ${HTTP_PORT}`) 
})
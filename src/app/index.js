import http from 'http'
import app from './app'

// We can run multiple instances on one machine, so take port from command line
const HTTP_PORT = process.env.HTTP_PORT || 3002

const server = http.createServer(app)
let currentApp = app

server.listen(HTTP_PORT, () => { 
    console.log(`Listening on port ${HTTP_PORT}`) 
})

// for any changes in the entry point file, hot reload doesn't work
// and restart of the application is needed

if (module.hot) {
    module.hot.accept('./app', () => {
        server.removeListener('request', currentApp)
        server.on('request', app)
        currentApp = app
    })
}
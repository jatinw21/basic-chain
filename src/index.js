import http from 'http'
import Block from './blockchain/block'
import app from './server'

const server = http.createServer(app)
let currentApp = app
server.listen(3000)

// for any changes in the entry point file, hot reload doesn't work
// and restart of the application is needed

if (module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', currentApp)
        server.on('request', app)
        currentApp = app
    })
}
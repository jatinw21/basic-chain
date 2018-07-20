import http from 'http'
import Block from './block'
import app from './server'
const block = new Block('test1', 'test2', 'test3', 'test4');
console.log(block.toString());

const server = http.createServer(app)
let currentApp = app

server.listen(3000)
if (module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', currentApp)
        server.on('request', app)
        currentApp = app
    })
}
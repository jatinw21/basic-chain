import http from 'http'
import Block from './block'
import app from './server'
const block = new Block('test1', 'test2', 'test3', 'test4')

// console.log("\n=====")
// console.log(block.toString())
// console.log("=====")

// console.log("\n=====")
// console.log(Block.genesis().toString())
// console.log("=====")

// const fooBlock = Block.mineBlock(Block.genesis(), "foo");
// console.log("\n=====")
// console.log(fooBlock.toString())
// console.log("=====")

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
import Websocket from 'ws'

const P2P_PORT = process.env.P2P_PORT || 5002
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

//  ws://localhost:5001,ws://localhost:5002 is one example of address of websocket
// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

// NOTE: Every node has its own blockchain that it maintains, but can also add to this blockchain
// There are other nodes on the network called peers, but some of them may actually
// connect with this node, which are called sockets and stored in the class instance
// Whenever a new block is mined on the network, the change is shared with the rest of the network
// and nodes accept the largest chain and keep the blockchain going

class P2PServer {
    constructor(blockchain) {
        this.blockchain = blockchain

        // list of connected ws servers
        this.sockets = []
    }

    listen() {
        const server = new Websocket.Server({ port: P2P_PORT })
        console.log(`Listening for peer to peer connections on: ${P2P_PORT}`)
        
        server.on('connection', socket => {this.connectSocket(socket)})
    }

    connectSocket() {
        this.sockets.push(socket)
        console.log(`Socket connected: ${socket._socket.remoteAddress}:${socket._socket.remotePort}`)
    }
}
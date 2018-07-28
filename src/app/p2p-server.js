import Websocket from 'ws'

const P2P_PORT = process.env.P2P_PORT || 5002
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = { 
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
 }

//  ws://localhost:5001,ws://localhost:5002 is one example of address of websocket
// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

// NOTE: Every node has its own blockchain that it maintains, but can also add to this blockchain
// There are other nodes on the network called peers, but some of them may actually
// connect with this node, which are called sockets and stored in the class instance
// Whenever a new block is mined on the network, the change is shared with the rest of the network
// and nodes accept the largest chain and keep the blockchain going

export default class P2PServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool

        // list of connected ws servers
        this.sockets = []
    }

    listen() {
        const server = new Websocket.Server({ port: P2P_PORT })
        console.log(`Listening for peer to peer connections on: ${P2P_PORT}`)
        
        server.on('connection', socket => {this.connectSocket(socket)})

        // if this node is started later, it should try to all existing peers specified
        this.connectToPeers()
    }

    connectSocket(socket) {
        this.sockets.push(socket)
        console.log(`Socket connected: ${socket._socket.remoteAddress}:${socket._socket.remotePort}`)

        // as soon as it connects, add a message handler to receive messages
        this.messageHandler(socket)

        // Now, send this blockchain so that other peer can receive it and sync etc.
        this.sendChain(socket)
    }

    connectToPeers() {
        peers.forEach(peer => {
            // ws://localhost:5006
            const socket = new Websocket(peer)

            // the specified socket might not be open yet, but we want to connect
            // to this peer as soon as that peer starts the Websocket server
            socket.on('open', () => this.connectSocket(socket))
        })
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message)
            // console.log('data:', data)
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
            }
        })
    }

    sendChain(socket) {        
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }))
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }))
    }

    // send updated bc of this server to others
    syncChains() {
        this.sockets.forEach(socket => {
            this.sendChain(socket)
        })
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction)
        })
    }
}
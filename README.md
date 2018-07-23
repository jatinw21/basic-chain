# Basic-chain
A basic implementation of a simple blockchain to practice its implementation and understand it more closely.

#### Node.js (Express) is used for backend, jest for testing.

#### Webpack and babel used to manage the project and transpile from ES6 to vanilla javascript

## Run
`npm install`

`npm run dev`

`/mine` endpoint for posting new blocks

`/blocks` endpoint for looking at current state of the blockchain

To run 3 instances for example so they establish websocket connection to each other, use commands like these

#### To start first node. This will use default HTTP_PORT 3002 and P2P_PORT 5002
`npm run dev`

#### To start second, we need to specify ports and peers which is the first app
`HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5002 npm run dev`

#### To start third,
`HTTP_PORT=3004 P2P_PORT=5004 PEERS=ws://localhost:5002,ws://localhost:5003npm run dev`

All sockets should be connected


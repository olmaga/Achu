const Websocket = require('ws');

const MESSAGE_TYPES = {
    chain: "CHAIN",
    transaction: "TRANSACTION",
    clearTransactions: "CLEAR_TRANSACTIONS"
};
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const viewerNode = 'https://achu-coin.herokuapp.com/';
if (!process.env.viewerNode && !process.env.standalone && !peers.includes(viewerNode)) {
    peers.push(viewerNode);
}

class P2pServer {
    constructor(httpServer, blockchain, transactionPool) {
        this.httpServer = httpServer;
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({ server: this.httpServer });
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening fo p2p connections`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            console.log(peer);
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected.')

        this.messageHandler(socket);

        this.sendChain(socket);

        socket.on('close', () => console.log('Client disconnected'));
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);

            switch (data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clearTransactions:
                    this.transactionPool.clear();
                    break;
            }
        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clearTransactions
        })));
    }
}

module.exports = P2pServer;
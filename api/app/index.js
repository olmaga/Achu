const express = require('express');
const path = require('path');
const Blockchain = require('../blockchain');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');
const P2pServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
// run it like this: `$ HTTP_PORT=3002 npm run dev`

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const pool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, pool);
const miner = new Miner(blockchain, pool, wallet, p2pServer);

app.use(express.json());


app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()} - successfully mined.`);

    p2pServer.syncChains();

    res.redirect('/api/blocks');
});

app.get('/api/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`)
    res.redirect('/api/blocks');
});

app.get('/api/transactions', (req, res) => {
    res.json(pool.transactions);
});

app.post('/api/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockchain, pool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/api/transactions');
});

app.get('/api/balance', (req, res) => {
    res.json({
        publicKey: wallet.publicKey,
        balance: wallet.calculateBalance(blockchain)
    });
});

app.get('/api/wallets', (req, res) => {
    res.json(blockchain.listWallets());
});

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
})

p2pServer.listen();
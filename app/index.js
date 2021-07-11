const express = require('express');
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

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()} - successfully mined.`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`)
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(pool.transactions);
});

app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockchain, pool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('transactions');
});

app.get('/balance', (req, res) => {
    res.json({
        publicKey: wallet.publicKey,
        balance: wallet.calculateBalance(blockchain)
    });
});

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
})

p2pServer.listen();
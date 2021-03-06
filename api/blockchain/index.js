const Wallet = require('../wallet');
const Block = require('./block');

class Blockchain {
    constructor() {
        const genesis = Block.genesis();
        this.chain = [genesis];
        this.addBlock([{
            "action": "name",
            "publicKey": genesis.publicKey,
            "name": "Genesis"
        }]);
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log("Received chain is not longer than the current one.");
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log("Received chain is not valid.");
            return;
        }

        console.log("Replacing blockchain with the new chain.");
        this.chain = newChain;
    }

    listWalletsIds() {
        const wallets = new Set();
        this.chain.forEach(block => block.data.forEach(transaction => {
            if (transaction.input && transaction.outputs) {
                wallets.add(transaction.input.address);
                transaction.outputs.forEach(output => {
                    wallets.add(output.address);
                })
            }
        }));
        return [...wallets];
    }

    listWallets() {
        const names = {};

        this.chain.forEach(block => block.data.forEach(transaction => {
            if (transaction.action === 'name') {
                names[transaction.publicKey] = transaction.name;
            }
        }));

        return this.listWalletsIds().map(id => {
            return {
                publicKey: id,
                name: names[id],
                balance: Wallet.calculateBalanceOf(id, this)
            }
        });
    }
}

module.exports = Blockchain;
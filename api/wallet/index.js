const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
            publicKey: ${this.publicKey.toString()}
            balance  : ${this.balance}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the current balance: ${this.balance}.`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        this.balance = Wallet.calculateBalanceOf(this.publicKey, blockchain);
        return this.balance;
    }

    static calculateBalanceOf(publicKey, blockchain) {
        let balance = INITIAL_BALANCE;
        let transactions = [];
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));

        const walletInputTransactions = transactions
            .filter(transaction => transaction.input && transaction.input.address === publicKey);

        let startTime = 0;
        if (walletInputTransactions.length > 0) {
            console.log(walletInputTransactions);
            const recentInputTransaction = walletInputTransactions.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            let outputTransaction = recentInputTransaction.outputs.find(output => output.address === publicKey);
            balance = outputTransaction ? outputTransaction.amount: 0;
            startTime = recentInputTransaction.input.timestamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input && transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === publicKey) {
                        balance += output.amount
                    }
                });
            }
        });
        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;
const Wallet = require(".");
const Blockchain = require("../blockchain");
const Transaction = require("./transaction");
const TransactionPool = require("./transaction-pool");

describe('TransactionPool', () => {
    let pool, wallet, transaction, blockchain;

    beforeEach(() => {
        pool = new TransactionPool();
        wallet = new Wallet();
        blockchain = new Blockchain();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, blockchain, pool);
    });

    it('adds a transaction to the pool', () => {
        expect(pool.transactions.indexOf(transaction)).toBe(0);
    });

    it('updatess a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-address', 40);
        pool.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(pool.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    it('clears transactions', () => {
        pool.clear();
        expect(pool.transactions).toEqual([]); 
    });

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...pool.transactions];
            for (let i = 0; i < 8; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4dr355', 30, blockchain, pool);
                if (i % 2 === 0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows a difference between valid and corrupted transactions', () => {
            expect(JSON.stringify(pool.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions', () => {
            expect(pool.validTransactions()).toEqual(validTransactions);
        });
    });
});
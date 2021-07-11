const Wallet = require(".");
const Blockchain = require("../blockchain");
const { INITIAL_BALANCE } = require("../config");
const TransactionPool = require("./transaction-pool");

describe('Wallet', () => {
    let wallet, pool, blockchain;

    beforeEach(() => {
        wallet = new Wallet();
        pool = new TransactionPool();
        blockchain = new Blockchain();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd-adress';
            transaction = wallet.createTransaction(recipient, sendAmount, blockchain, pool);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, blockchain, pool)
            });

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });

    describe('calculating a balance', () => {
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;

            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, pool);
            }
            blockchain.addBlock(pool.transactions);
        });

        it('calculates the balance for blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });

        it('calculates the balance for blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(blockchain)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

        describe('and the recipient conducts a transaction', () => {
            let subtractBalance, recipientBalance;

            beforeEach(() => {
                pool.clear();
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(blockchain);
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, blockchain, pool);
                blockchain.addBlock(pool.transactions);
            });

            describe('and the sender sends another transaction to the recipient', () => {

                beforeEach(() => {
                    pool.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, pool);
                    blockchain.addBlock(pool.transactions);
                });
                
                it('calculates the recipient balance only using transactions sine its most recent one', () => {
                    expect(wallet.calculateBalance(blockchain)).toEqual(recipientBalance - subtractBalance + addBalance);
                });

            });
        });
    });

});
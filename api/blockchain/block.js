const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config')

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        let time = ("" + new Date(this.timestamp));
        if (time.includes("GMT")) {
            time = time.substring(0, time.indexOf("GMT") - 1);
        }
        return `Block - 
            Timestamp : ${time}
            Last Hash : ${this.lastHash ? this.lastHash.substring(0, 10) + '...' : 'Genesis'}
            Hash      : ${this.hash.substring(0, 10)}...
            Nonce     : ${this.nonce}
            Data      : ${JSON.stringify(this.data)}
            Difficulty: ${this.difficulty}`;
    }

    static genesis() {
        return new this('Genesis Time', '----------', '1337--1337', [], 0, DIFFICULTY)
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;
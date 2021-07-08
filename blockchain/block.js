const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        let time = ("" + new Date(this.timestamp));
        if (time.includes("GMT")) {
            time = time.substring(0, time.indexOf("GMT") - 1);
        }
        return `Block - 
            Timestamp: ${time}
            Last Hash: ${this.lastHash ? this.lastHash.substring(0, 10)+'...' : 'Genesis'}
            Hash     : ${this.hash.substring(0, 10)}...
            Data     : ${this.data}`;
    }

    static genesis() {
        return new this('Genesis Time', '----------', '1337--1337', [])
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);

        return new Block(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block) {
        const {timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    }
}

module.exports = Block;
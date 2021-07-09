const Blockchain = require('./blockchain');

const chain = new Blockchain();

for (let i = 0; i < 10; i++) {
    console.log(chain.addBlock(`foo ${i}`).toString());
}
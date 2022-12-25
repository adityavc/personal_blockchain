const SHA256 = require('crypto-js/sha256');

class Block {
    //index: location of block in chain
    //prevHash: need hash of previous block in chain to maintain integrity
    constructor(index, time, data, prevHash) {
        this.index = index;
        this.time = time;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.time + JSON.stringify(this.data) + this.prevHash).toString();
    }

}
class BlockChain {
    constructor() {
        //array of blocks
        this.chain = [this.createGenesisBlock()];
    }
    //create first block(genesis block)
    createGenesisBlock() {
        return new Block(0,"12/24/2022","Genesis-block","0");
    }
    getRecentBlock() {
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock) {
        newBlock.prevHash = this.getRecentBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; ++i) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if(currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

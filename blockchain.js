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
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.time + JSON.stringify(this.data) + this.prevHash + this.nonce).toString();
    }
    mineBlock(difficulty) {
        //proof of work
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {
            ++this.nonce;
            //changed the block -- will calculate new hash
            this.hash = this.calculateHash();
        }
        //valid hash found
        console.log("Block mined: " + this.hash);
    }

}
class BlockChain {
    constructor() {
        //array of blocks
        this.chain = [this.createGenesisBlock()];
        //difficulty controls how fast blocks can be added to the blockchain
        this.difficulty = 5;
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
        newBlock.mineBlock(this.difficulty);
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
// let myCoin = new BlockChain();

// console.log('Mining block 1...');
// myCoin.addBlock(new Block(1,"12/25/2022",{amount: 4}));

// console.log('Mining block 2...');
// myCoin.addBlock(new Block(1,"12/26/2022",{amount: 10}));
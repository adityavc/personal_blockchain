const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    //index: location of block in chain
    //prevHash: need hash of previous block in chain to maintain integrity
    constructor(time, transactions, prevHash) {
        this.time = time;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.time + JSON.stringify(this.data) + this.prevHash + this.nonce).toString();
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
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    //create first block(genesis block)
    createGenesisBlock() {
        return new Block(0,"12/24/2022","Genesis-block","0");
    }
    getRecentBlock() {
        return this.chain[this.chain.length-1];
    }
    minePendingTransactions(miningRewardAdress) {
        //at interval add block (and all pending transactions) to chain and transfer rewards
        let block = new Block(Date.now(), this.pendingTransactions);
        block.prevHash = this.getRecentBlock().hash;
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAdress, this.miningReward)
        ];

    }
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                } else if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
// myCoin.createTransaction(new Transaction('address1','address2',100));
// myCoin.createTransaction(new Transaction('address2','address1',50));

// console.log('\n Starting miner.');
// myCoin.minePendingTransactions('myaddress');
// console.log('Balance of myaddress', myCoin.getBalanceOfAddress('myaddress'));


// console.log('\n Starting miner.');
// myCoin.minePendingTransactions('myaddress');
// console.log('Balance of myaddress', myCoin.getBalanceOfAddress('myaddress'));

// console.log('Mining block 1...');
// myCoin.addBlock(new Block(1,"12/25/2022",{amount: 4}));

// console.log('Mining block 2...'); 
// myCoin.addBlock(new Block(1,"12/26/2022",{amount: 10}));
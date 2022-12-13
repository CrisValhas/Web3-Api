const axios = require('axios');
require('dotenv').config();
const API_KEY = process.env.API_KEY;
const API_KEY_3 = process.env.API_KEY_3;
const Web3 = require('web3');


const transactionChecker = async (req, res, next) => {
    const { walletAdress } = req.body;
    const { contractAdress } = req.body;
    //chequeo tener los datos necesarios
    if (walletAdress === undefined || contractAdress === undefined) {
        console.log('Wallet or contract adress is not valid')
        return res.status(400).json({ error: 'Wallet or contract adress is not valid' })
    }
    console.log('lets find the transaction...');
    //inicializo el provider infura y las variables necesarias//
    // let Web3 = require('web3');
    let provider = 'https://mainnet.infura.io/v3/'+API_KEY;
    let web3Provider = new Web3.providers.HttpProvider(provider);
    let web3 = new Web3(web3Provider);
    let number = 0;
    let txHash = "empty";

    //--Utils--//
    //Chequea el TxHash para encontrar el match con la wallet
    const TxHashChecker = async (currentHash) => {
        tx = await web3.eth.getTransaction(currentHash);
        if (walletAdress.toLowerCase() === tx.to.toLowerCase() && contractAdress.toLowerCase() === tx.from.toLowerCase() ||
            contractAdress.toLowerCase() === tx.to.toLowerCase() && walletAdress.toLowerCase() === tx.from.toLowerCase()) {
            txHash = currentHash;
        }
    };
    //Chequea en un rango de bloques el match de transacciones con el contract adress 
    const findBlock = async () => {
        let transactions = await web3.eth.getPastLogs({
            fromBlock: Number(number - 10000),
            toBlock: Number(number),
            address: contractAdress,
        })
        if (number > 0) {
            if (transactions.length === 0) {
                if (txHash === "empty") {
                    number = (number - 10000);
                    findBlock()
                }
            } else {
                transactions.map(e => TxHashChecker(e.transactionHash)
                );
                if (txHash !== "empty") {
                    return res.status(200).json(txHash)
                }
                else {
                    number = (number - 10000);
                    console.log(number)
                    findBlock()
                };
            };
        } else {
            return res.status(400).json({ message: "Not found Transacction between these parameters" });
        };
    };

    try {
        let block = await web3.eth.getBlock("latest");
        if (block != null && block.transactions != null) {
            number = block.number;
            console.log("searching in block "+ block.numer)
            findBlock();
        }
        else {
            return res.status(400).json({ message: "could not get block" });
        };
    } catch (error) {
        return (error);
    };
};

const moreTransactionChecker = async (req, res, next) => {
    const { walletAdress } = req.body;
    const { contractAdress } = req.body;
    //chequeo tener los datos necesarios
    if (walletAdress === undefined || contractAdress === undefined) {
        console.log('Wallet or contract adress is not valid')
        return res.status(400).json({ error: 'Wallet or contract adress is not valid' })
    }
    console.log('lets find the transaction...');
    //inicializo el provider infura y las variables necesarias//
    let Web3 = require('web3');
    let provider = 'https://mainnet.infura.io/v3/' + API_KEY;
    let web3Provider = new Web3.providers.HttpProvider(provider);
    let web3 = new Web3(web3Provider);
    let number = 0;
    let firstBlock = 0;
    let lastBlock = 0;
    let response = "";
    let walletFounded = [];
    let counter = {};
    if (Array.isArray(walletAdress)) {
        walletAdress.map(e => counter[e] = [])
    } else {
        return res.status(400).json({ message: "walletAdress is not a Array format" });
    }
    //--Utils--//
    //Chequea el TxHash para encontrar el match con la wallet y los agrega al contador 
    const TxHashcounter = async (currentHash) => {
        tx = await web3.eth.getTransaction(currentHash);
        walletAdress.map(e => {
            if (e.toLowerCase() === tx.to.toLowerCase() && contractAdress.toLowerCase() === tx.from.toLowerCase() ||
                contractAdress.toLowerCase() === tx.to.toLowerCase() && e.toLowerCase() === tx.from.toLowerCase()) {
                counter.e.push(tx);
                console.log(counter);
            };
        });
    };

    const countTransactions = async () => {
        console.log('searching from block ' + firstBlock + ' to block ' + (firstBlock + 10000))
        let transactions = await web3.eth.getPastLogs({
            fromBlock: firstBlock,
            toBlock: (number + 10000),
            address: contractAdress,
        })
        if (number <= lastBlock) {
            if (transactions.length === 0) {
                console.log("aumentando numero de bloques en if");
                number = (number + 10000);
                firstBlock = (firstBlock + 10000);
                countTransactions();
            } else {
                // return res.status(200).json(transactions)
                transactions.map(e => TxHashcounter(e.transactionHash));
                console.log("aumentando numero de bloques en else");
                number = (number + 10000);
                firstBlock = (firstBlock + 10000);
                countTransactions();
            };
        } else {
            walletAdress.map(e => counter.e.length > walletFounded.length ?
                (walletFounded = counter.e, response = e)
                : null);
            return res.status(200).json({ message: "The wallet with more inteaccion is " + response });
        };
    };

    try {
        const earliestBlock = 12837283;
        //await web3.eth.getBlock("earliest");
        firstBlock = earliestBlock;
        const latestBlock = await web3.eth.getBlock("latest");
        number = earliestBlock;
        if (latestBlock != null && latestBlock.transactions != null) {
            firstBlock = earliestBlock;
            lastBlock = latestBlock.number;
            countTransactions();
        }
        else {
            return res.status(400).json({ message: "could not get block" });
        }
    } catch (error) {
        return (error);
    };
};

const apiLastTransaction = async (req, res, next) => {
    try {
        const { walletAdress } = req.body;
        const { contractAdress } = req.body;
        //chequeo tener los datos necesarios
        if (walletAdress === undefined || contractAdress === undefined) {
            console.log('Wallet or contract adress is not valid');
            return res.status(400).json({ error: 'Wallet or contract adress is not valid' });
        };
        let transaction = await axios.get(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAdress}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY_3}`);
        if (transaction.data.result.length > 0) {
            transaction.data.result.map(tx => {
                if (walletAdress.toLowerCase() === tx.to.toLowerCase() && contractAdress.toLowerCase() === tx.from.toLowerCase() ||
                    contractAdress.toLowerCase() === tx.to.toLowerCase() && walletAdress.toLowerCase() === tx.from.toLowerCase()) {
                    return res.status(200).json(tx);
                };
            });
        };
    } catch (error) {
        return next(error)
    };
};

const apiMoreTransaction = async (req, res, next) => {
    try {
        const { walletAdress } = req.body;
        const { contractAdress } = req.body;
        //chequeo tener los datos necesarios
        if (walletAdress === undefined || contractAdress === undefined) {
            console.log('Wallet or contract adress is not valid');
            return res.status(400).json({ error: 'Wallet or contract adress is not valid' });
        };
        let counter = {};
        if (Array.isArray(walletAdress)) {
            for (let wallet of walletAdress) {
                counter[wallet] = [];
                const transaction = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY_3}`);
                if (transaction.data.result.length > 0) {
                    transaction.data.result.map(tx => {
                        if (wallet.toLowerCase() === tx.to.toLowerCase() && contractAdress.toLowerCase() === tx.from.toLowerCase() ||
                        contractAdress.toLowerCase() === tx.to.toLowerCase() && wallet.toLowerCase() === tx.from.toLowerCase()) {
                                counter[wallet].push(tx);
                        };
                    });
                };
            };
        }else{
            return res.status(400).json({message: "error wallet adress format , must be an Array"});
        };

        let util = [];
        let walletFounded = "";
        walletAdress.map(e => counter[e].length > util.length ? (util = counter[e], walletFounded = e) : null);
        if (util.length > 0) {
            return res.status(200).json(walletFounded);
        }else{
            return res.status(400).json({message: "error in search , please try again"});
        }
    } catch (error) {
        return next(error)
    };
};

module.exports = { 
    transactionChecker,
    moreTransactionChecker,
    apiLastTransaction,
    apiMoreTransaction 
};
const express = require("express");
// require('ejs')
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

//Static Files
app.use(express.static('src'))
app.use('/css',express.static(__dirname + 'src/css'))
app.use('/css',express.static(__dirname + 'src/js'))
app.use('/css',express.static(__dirname + 'src/img'))
app.use('/css',express.static(__dirname + 'src/image'))
app.use('/css',express.static(__dirname + 'src/dist'))
app.use('/css',express.static(__dirname + 'src/fonts'))


//Set Views
app.set('views', './src/views');
app.set('view engine', 'ejs');

// app.get("/", (req, res) => {
//     res.render('index',{ text: 'This is EJS', text2: 'Data 2', text3: 'Data 3' })
// //   res.sendFile(__dirname + '//index.html');
// //   res.send("Hello world!!!");

// });



//blockchain
require('dotenv').config()
const Web3 = require('web3');
const { ethers, utils, TransactionRequest } = require('ethers');
const abi = require('./TokenMintERC20MintableToken.json')

const web3 = new Web3(process.env.INFURA_KOVAN)
const provider = ethers.getDefaultProvider('kovan', {
    infura: process.env.INFURA_KOVAN
})

//Loca host Ganache
const jsonprovider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const ganachePK = `9795a3b29fc8418965868b58faa08dbe78d856d82e11a49012aaf6fc7858b217`
const ganacheSigner = jsonprovider.getSigner();

/*jsonprovider.getBlockNumber()
.then(function(blknum) {
    console.log(`${blknum}`);
})*/
var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(function(){console.log("It's 10am!")}, millisTill10);

// create instance of TokenMin
let contract = new ethers.Contract("0xAD7958dd7C8645B8eB3F59A5Bcd99962C06a781f", abi, jsonprovider )
contract.balanceOf("0xE5A9E48f46Ed2efC99553d1bae8acD4d325D7748")
.then(function(bal) {
    // console.log(`BalanceOf ${bal}`)
    
    // app.get("/", (req, res) => {
    //     res.render('vegas-coin-machine',{ balanceOf: bal })
    // //   res.sendFile(__dirname + '//index.html');
    // //   res.send("Hello world!!!");

    // });
})

contract.spinSlotMachine(9999)
.then(function(results) {
    var randoms1 = results[0]+ ''.split();
    var randoms2 = results[1]+ ''.split();
    var randoms3 = results[2]+ ''.split();
    console.log(`${results[0]}::${results[1]}::${results[2]}`);
    // console.log(random1[0]);

    app.get("/", (req, res) => {
        res.render('vegas-coin-machine',{ randoms1: randoms1, randoms2: randoms2, randoms3: randoms3 })
    //   res.sendFile(__dirname + '//index.html');
    //   res.send("Hello world!!!");

    });
})
 
// Create Signer.  This is to sign transaction using the user's private key
// const signer = new ethers.Wallet(ganachePK,jsonprovider)
// const account = ganacheSigner.connect(jsonprovider)
    






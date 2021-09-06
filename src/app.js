const express = require("express");

const app = express();

app.use(express.urlencoded({extended:true}))
// Process application/json
app.use(express.json());



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
app.set("views", "path/to/views")

//Set Views
app.set('views', './src/views/partial_view');
app.set('views', './src/views');
app.set('view engine', 'ejs');
    
var Promise = require("bluebird");
var randomNumber = require("random-number-csprng");
let trueRandom = 0;

//blockchain
require('dotenv').config()
const Web3 = require('web3');
const { ethers, utils, TransactionRequest } = require('ethers');
const abi = require('./TokenMintERC20MintableToken.json')

const web3 = new Web3(process.env.INFURA_KOVAN)
const provider = ethers.getDefaultProvider('kovan', {
    infura: process.env.INFURA_KOVAN
})

//Local host Ganache
const jsonprovider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:7545`);
const ganachePK = `e4a7aa9fca5bf0012fcc7add7857521e5e46239d5904e6b62d8c8ed53c91155b`;
const ganacheSigner = jsonprovider.getSigner();

// create instance of TokenMin
let contract = new ethers.Contract("0x68fAf5f1F3Dccc923a9a664659F21FA2eDCCCA61", abi, jsonprovider )
contract.balanceOf("0x79bc53CBcB9A525f34F4eB652DF8F92a34fC4184")
.then(function(bal) {
 
});
spinSlotMachine();

function spinSlotMachine () {
    Promise.try(function() {
        return randomNumber(900, 1000);
    }).then(function(number) {
        contract.spinSlotMachine(number)
        .then(function(results) {
            // var randoms1 = results[0]+ ''.split();
            // var randoms2 = results[1]+ ''.split();
            // var randoms3 = results[2]+ ''.split();
            var slotActionType = [1,2,3];
            var i = 0;
    
            // console.log(getRandomAction);
            console.log(`${results[0]}::${results[1]}::${results[2]}`);
            
            let slots = [{},{},{}];
    
            slots.map(slot => {
                var randomsvalue = results[i]+ ''.split();
                slot.type = slotActionType[Math.floor(Math.random() * slotActionType.length)]; // burn mint airdop
                slot.value = randomsvalue[0];
                i++
    
            })
    
            console.log(slots);
            // app.get("/", (req, res) => {
            //     res.render('website',{ randoms1: randoms1, randoms2: randoms2, randoms3: randoms3 })
            // //   res.sendFile(__dirname + '//index.html');
            // //   res.send("Hello world!!!");
            // });
        })
        // trueRandom = number;
        // console.log("Your random number:", number);
    }).catch({code: "RandomGenerationError"}, function(err) {
        console.log("Something went wrong!");
    });
}


app.post('/slotMachinResult', function(req, res){  
    //now req.body will be populated with the object you sent
    console.log(req.body); //prints john
    // if (req.dominant == 0) {
    //     // contract.spinSlotMachine(number);
    // } else if (req.dominant == 1) {
    //     contract._burn(req.burn_result);
    // } else {
    //     contract._mint(req.mint_result);
    // }
    
    // contract.then(function(results) {
       
    // })
});

app.post('/rouletteAction', function(req, res){  
    //now req.body will be populated with the object you sent
    console.log(req.body); //prints john
    if (req.dominant == 0) {
        contract.transfer('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b',req.rouletteResult);
    } else if (req.dominant == 1) {
        contract._burnFrom('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b',req.rouletteResult);
    } else {
        contract.addMinter('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b');
        contract.mint('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b',req.rouletteResult);
    }
    
    contract.then(function(results) {
       console.log(results);
    });
});





    
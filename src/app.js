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

////Create Signer.  This is to sign transaction using the user's private key
const signer = new ethers.Wallet('9d43d1a4e69c07484c882f70ce2c73831b7f6d77a2db6f643e278426a9cc440c',provider)
const account = signer.connect(provider)
const transactionReq = TransactionRequest



// create instance of TokenMin
let contract = new ethers.Contract("0x63c8880EdFE21c73bFD426e262c704FF926F197F", abi, jsonprovider )
contract.balanceOf("0xd8f3975c68ad67cF0147bE24136e9A5fe484d781")
.then(function(bal) {
    console.log(`BalanceOf ${bal}`)
});

// const mint = contract._mint('0x39D8414F338d78317AaB059975E8d7489ff370b9', 0.001);



app.get("/", (req, res) => {
    res.render('website')
});


async function slotMachineResult(){
   let slotResult = await spinSlotMachine();
   return slotResult;
}

function spinSlotMachine () {  
    let slotResult =  Promise.try(function() {
        return randomNumber(900, 1000);
    }).then(function(number) {
        let contractSpin = contract.spinSlotMachine(number).then(function(results) {
            var dateNow = Date.now();
            var today = new Date(dateNow);
            var dateFormatted = today.toDateString();
            var slotActionType = [1,2,3];
            var i = 0;
            var air_drop_result= 0;
            var burn_result= 0;
            var mint_result= 0;
            var actions = [];
            var dominantAction ;
            const actionTypeEnum = {
                1:"AIR_DROP",
                2:"BURN",
                3:"MINT"
            }
            
            let slot = {results:[{},{},{}]};
            slot.results.map(result => {
                var randomsvalue = results[i]+ ''.split();
                var slotResult = randomsvalue[Math.floor(Math.random() * randomsvalue.length)]
                var actionType = slotActionType[Math.floor(Math.random() * slotActionType.length)] ;
                air_drop_result = actionType == 1 ? +air_drop_result + +slotResult : air_drop_result;
                burn_result = actionType == 2 ? +burn_result + +slotResult : burn_result;
                mint_result = actionType == 3 ? +mint_result + +slotResult : mint_result;

                result.type = actionTypeEnum[`${actionType}`]; // burn mint airdop
                result.value =slotResult;
                i++
            });

            actions.push(air_drop_result, burn_result, mint_result);
            dominantAction = +findDominantAction(actions) + +1;
        
            slot.airdrop = air_drop_result;
            slot.burn = burn_result;
            slot.mint = mint_result;
            slot.dominant = dominantAction == actionTypeEnum.AIR_DROP ? 'Air Drop' : dominantAction == actionTypeEnum.BURN ? 'Burn' : 'Mint';
            slot.value = dominantAction == 1 ? air_drop_result : dominantAction == 2 ? burn_result : mint_result;
            slot.date = dateFormatted;
            return new Promise(resolve => {resolve(slot)});
        })
        return contractSpin
    })
    return slotResult;
}
// console.log(spinSlotMachine);
function findDominantAction(numericValues) {

    // console.log(numericValues);

    var max = -Infinity; // calling Math.max with no arguments returns -Infinity
    var maxName = null;
    for (var key in numericValues) {
        var num = numericValues[key];

        if (num > max) {
            max = num;
            maxName = key;
        }

        max = (num > max && num) || max;
    }

    return maxName;
}
app.get('/slotMachinResult', async(req, res) => {  
    let slotResult = await spinSlotMachine();

    res.json(slotResult);
    console.log(slotResult);
    // console.log(slotResult);
    // return new Promise(resolve => {resolve(slotResult)});

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





    
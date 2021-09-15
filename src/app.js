const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }))
// Process application/json
app.use(express.json());

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
});

const AWS = require('aws-sdk');
const short = require('short-uuid');

//Static Files
app.use(express.static('src'))
app.use('/css', express.static(__dirname + 'src/css'))
app.use('/css', express.static(__dirname + 'src/js'))
app.use('/css', express.static(__dirname + 'src/img'))
app.use('/css', express.static(__dirname + 'src/image'))
app.use('/css', express.static(__dirname + 'src/dist'))
app.use('/css', express.static(__dirname + 'src/fonts'))
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
const abi = require('./TokenMintERC20MintableToken.json');
const { json } = require("express");

//db functions
// import { getResults,addOrUpdateresult } from './DBfunctions/dbFunctions'; 

const web3 = new Web3(process.env.INFURA_KOVAN)
const provider = ethers.getDefaultProvider('kovan', {
    infura: process.env.INFURA_KOVAN
})

//Local host Ganache
const jsonprovider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545`);
const ganachePK = `e4a7aa9fca5bf0012fcc7add7857521e5e46239d5904e6b62d8c8ed53c91155b`;
const ganacheSigner = jsonprovider.getSigner();

////Create Signer.  This is to sign transaction using the user's private key
const signer = new ethers.Wallet('9d43d1a4e69c07484c882f70ce2c73831b7f6d77a2db6f643e278426a9cc440c', provider)
const account = signer.connect(provider)
const transactionReq = TransactionRequest

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = "results"
const TABLE_NAME_OVER_ALL_RESULT = "overAllResults"

async function getResults() {
    const params = {
        TableName: TABLE_NAME,
    };
    const results = await dynamoClient.scan(params).promise();
    return results;
};


async function getresultByDate(date) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: 'date-index',
        KeyConditionExpression: '#date = :date',
        ExpressionAttributeNames: { '#date': 'date' },
        ExpressionAttributeValues: {
            ":date": date
        },
    };

    const results = await dynamoClient.query(params).promise();
    return results;
};


async function addOrUpdateresult(result) {
    const params = {
        TableName: TABLE_NAME,
        Item: result,
    };
    return await dynamoClient.put(params).promise();
};

async function addOrUpdateOverAllresult(result) {
    const params = {
        TableName: TABLE_NAME_OVER_ALL_RESULT,
        Item: result,
    };
    return await dynamoClient.put(params).promise();
};
async function getOverAllResultByDate(date) {
    const params = {
        TableName: TABLE_NAME_OVER_ALL_RESULT,
        IndexName: 'date-index',
        KeyConditionExpression: '#date = :date',
        ExpressionAttributeNames: { '#date': 'date' },
        ExpressionAttributeValues: {
            ":date": date
        },
        // Limit: 1,
        // ScanIndexForward: true,
    };
    // console.log(params)
    const results = await dynamoClient.query(params).promise();
    return results;
};

// create instance of TokenMin
let contract = new ethers.Contract("0x6AA0f2b282A829cFeCa3f54C14f92550FFe3ddEE", abi, jsonprovider)
contract.balanceOf("0x2d6d874D0f3c86aa82bfec38cFe76c393C7c4Ac0")
    .then(function (bal) {
        console.log(`BalanceOf ${bal}`)
    });

// const mint = contract._mint('0x39D8414F338d78317AaB059975E8d7489ff370b9', 0.001);



app.get("/", (req, res) => {
    res.render('website')
});


// async function slotMachineResult(){
//    let slotResult = await spinSlotMachine();
//    return slotResult;
// }
// spinSlotMachine();
function spinSlotMachine() {
    let slotResult = Promise.try(function () {
        return randomNumber(900, 1000);
    }).then(function (number) {

        let contractSpin = contract.spinSlotMachine(number).then(function (results) {
            var dateNow = Date.now();
            var today = new Date(dateNow);
            var dateFormatted = today.toDateString();
            let getResultByDate = getresultByDate(dateFormatted)
                .then(function (resultByDate) {

                    var slotActionType = [1, 2, 3];
                    var i = 0;
                    var air_drop_result = 0;
                    var burn_result = 0;
                    var mint_result = 0;
                    var actions = [];
                    var dominantAction;
                    var count = resultByDate.Items == 0 || resultByDate.Count == 7 ? 1 : resultByDate.Count + 1;
                    console.log(count);

                    const actionTypeEnum = {
                        1: "AIR_DROP",
                        2: "BURN",
                        3: "MINT"
                    }

                    let slot = { results: [{}, {}, {}] };
                    slot.results.map(result => {
                        var randomsvalue = results[i] + ''.split();
                        var slotResult = randomsvalue[Math.floor(Math.random() * randomsvalue.length)]
                        var actionType = slotActionType[Math.floor(Math.random() * slotActionType.length)];

                        air_drop_result = actionType == 1 ? +air_drop_result + +slotResult : air_drop_result;
                        burn_result = actionType == 2 ? +burn_result + +slotResult : burn_result;
                        mint_result = actionType == 3 ? +mint_result + +slotResult : mint_result;

                        result.type = actionTypeEnum[`${actionType}`]; // burn mint airdop
                        result.value = slotResult;
                        i++
                    });

                    actions.push(air_drop_result, burn_result, mint_result);
                    dominantAction = +findDominantAction(actions) + +1;
                    slot.id = short.generate();
                    // console.log(resultByDate.Count);
                    slot.count = count;
                    slot.airdrop = air_drop_result;
                    slot.burn = burn_result;
                    slot.mint = mint_result;
                    slot.dominant = actionTypeEnum[dominantAction];
                    slot.value = dominantAction == 1 ? air_drop_result : dominantAction == 2 ? burn_result : mint_result;
                    slot.date = dateFormatted;

                    return new Promise(resolve => { resolve(slot) });


                })

            return getResultByDate;

        })
        return contractSpin
    })
    return slotResult;
}


app.get('/slotMachinResult', async (req, res) => {

    let slotResults = await spinSlotMachine()

    //insert slot result
    let insert = await addOrUpdateresult(slotResults)

    //check day if 7 days 
    var dateNow = Date.now();
    var today = new Date(dateNow);
    var dateFormatted = today.toDateString();

    let getAllResultsByDate = await getresultByDate(dateFormatted)
    
    if (getAllResultsByDate.Count == 7){
        var air_drop_result = 0;
        var burn_result = 0;
        var mint_result = 0;
        var actions =[];
        var dominantAction;
        const actionTypeEnum = {
            AIR_DROP:1,
            BURN:2,
            MINT:3
        }
        const valueEnum = {
            AIR_DROP:air_drop_result,
            BURN:burn_result,
            MINT:mint_result
        }

        getAllResultsByDate.Items.forEach(Items => {
            Items.results.forEach(result => {
                air_drop_result = actionTypeEnum[result.type] == 1 ? +air_drop_result + +result.value : air_drop_result;
                burn_result = actionTypeEnum[result.type] == 2 ? +burn_result + +result.value : burn_result;
                mint_result = actionTypeEnum[result.type] == 3 ? +mint_result + +result.value : mint_result;

            });
        });
   
        actions.push(air_drop_result, burn_result, mint_result);
        dominantAction = +findDominantAction(actions) + +1;

        let slotOverAllResult = {};
        
        slotOverAllResult.id = short.generate();
        slotOverAllResult.dominantAction = dominantAction;
        slotOverAllResult.date = dateFormatted;
        slotResults.overAll = slotOverAllResult;

        await addOrUpdateOverAllresult(slotOverAllResult)
    } 
        
    res.json(slotResults)

});

function findDominantAction(numericValues) {
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
app.get('/getOverAllResult', async (req, res) => {
    // console.log('get overall result');
    // let getOverAllResultByDate = await getOverAllResultByDate();
    // console.log(getOverAllResultByDate);
    var dateNow = Date.now();
    var today = new Date(dateNow);
    var dateFormatted = today.toDateString();

    let getOverAllResult = await getOverAllResultByDate(dateFormatted).then(function (result) {
        res.json(result);

        console.log(result)
    })
    return getOverAllResult;
})
app.post('/rouletteAction', function (req, res) {
    //now req.body will be populated with the object you sent
    var rouletteResultJSON = JSON.parse(Object.keys(req.body));
    var roulleteResult = rouletteResultJSON['rouletteResult'];

   

    console.log(Math.floor(roulleteResult * 3000000000000),'roulette to send action');
    // console.log(rouletteResultJSON['rouletteResult']);
    // console.log(req.rouletteResult)
    // if (req.dominant == 1) {
    //     contract.transfer('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b', req.rouletteResult);
    // } else if (req.dominant == 2) {
    //     contract._burnFrom('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b', req.rouletteResult);
    // } else {
    //     contract.addMinter('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b');
    //     contract.mint('0x781995eD1c9fA6812EC2653b5F2E0e6A21839F3b', req.rouletteResult);
    // }

    // contract.then(function (results) {
    //     console.log(results);
    // });
});






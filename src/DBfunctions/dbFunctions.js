const AWS = require('aws-sdk');
const short = require('short-uuid');

require('dotenv').config()


AWS.config.update({
    region:process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})



const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = "results"

export const getResults = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const results = await dynamoClient.scan(params).promise();
    console.log(results)
    return results;
};

// getResults();

export const getresultById = async (date) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    const results = await dynamoClient.get(params).promise();
    return results;
};

let item = {
    results: [
        {
            type: 'mint',
            value: 10
        },
        {
            type: 'burn',
            value: 10
        },
        {
            type: 'mint',
            value: 2
        }
    ],
    dominant: 'mint',
    value: 12,
    counter: 1,
    date:  `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
    id: short.generate()
}

export const addOrUpdateresult = async (result) => {
    const params = {
        TableName: TABLE_NAME,
        Item: result,
    };
    return await dynamoClient.put(params).promise();
};

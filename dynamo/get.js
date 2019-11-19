'use strict'

const aws = require('aws-sdk')
const db = new aws.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id
            }
        }
        const res = await db.get(params).promise()

        if(typeof(res) == aws.AWSError){
            console.log(res)
            return {
                statusCode: res.statusCode || 501,
                body: JSON.stringify({message: 'Failed to fetch', error: res})
            }
        }else{
            return {
                statusCode: 200,
                body: JSON.stringify(res.Item)
            }
        }
    } catch(err){
        console.log(err)
        return {
            statusCode: err.statusCode || 404,
            body: JSON.stringify({message: err.message || 'Failed to fetch'})
        }
    }
}
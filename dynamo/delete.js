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
        const res = await db.delete(params).promise()

        if(typeof(res) == aws.AWSError)
            throw err

        else
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Successfully deleted'})
            }
        
    } catch(err){
        console.log(err)
        return {
            statusCode: err.statusCode || 501,
            body: JSON.stringify({message: err.message || 'Failed to delete'})
        }
    }
}
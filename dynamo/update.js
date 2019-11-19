'use strict'

const aws = require('aws-sdk')
const db = new aws.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
    try {
        const timestamp = new Date().getTime()
        const data = JSON.parse(event.body)

        if(!data.message)
            throw err

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id
            },
            ExpressionAttributeValues: {
                ':message': data.message,
                ':updateAt': timestamp
            },
            UpdateExpression: 'SET message = :message, updateAt = :updateAt',
            ReturnValues: 'ALL_NEW'
        }
        
        const res = await db.update(params).promise()

        if(typeof(res) == aws.AWSError){
            console.log(res)
            return {
                statusCode: res.statusCode || 501,
                body: JSON.stringify({message: 'Failed to update', error: res})
            }
        }else{
            return {
                statusCode: 200,
                body: JSON.stringify(res.Attributes)
            }
        }
    } catch(err){
        console.log(err)
        return {
            statusCode: err.status || 404,
            body: JSON.stringify({message: err.message || 'Failed to fetch'})
        }
    }
}
'use strict'

const aws = require('aws-sdk')
const uuid = require('uuid')
const db = new aws.DynamoDB.DocumentClient()

module.exports.handler = async (event) => {
  try {
    const timestamp = new Date().getTime()
    const id = uuid.v1()
    const data = JSON.parse(event.body)

    if (!data.message)
        throw err

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: id,
            message: data.message,
            createdAt: timestamp,
            updateAt: timestamp
        },
        ReturnValues: 'ALL_OLD'
    }

    const res = await db.put(params).promise()

    if(typeof(res) == aws.AWSError){
        console.log(res)
        return {
            statusCode: res.statusCode || 501,
            body: JSON.stringify({message: 'Failed to insert', error: res})
        }
    }else{
        return {
            statusCode: 301,
            body: JSON.stringify({message: 'Successfully inserted', data: {id, message: data.message}})
        }
    }
        
  } catch(err) {
    console.log(err)
    return {
      statusCode: err.statusCode || 400,
      body: JSON.stringify({message: err.message || 'Failed to insert'})
    }
  }
}
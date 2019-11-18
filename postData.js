'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3()

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const key = Math.floor(Math.random() * 100)

    if(!body.message)
      throw err
    
    await s3.putObject({
      Body: body.message,
      Bucket: process.env.BUCKET,
      ContentType: 'text/plain',
      Key: `${key}.txt`
    }).promise()

    return {
      statusCode: 301,
      body: JSON.stringify({ message: `Successfully created. ID: ${key}` })
    }
  } catch(err) {
    console.log(err)
    
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad request' })
    }
  }
}
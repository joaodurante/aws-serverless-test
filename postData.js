'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3()

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const key = Math.floor(Math.random() * 100)

    await s3.putObject({
      Body: body.message,
      Bucket: process.env.BUCKET,
      ContentType: 'text/plain',
      Key: `${key}.txt`
    }).promise()

    const response = {
      statusCode: 301,
      body: JSON.stringify({ message: `Successfully created. ID: ${key}` })
    }

    return response
  } catch(err) {
    console.log(err)
  }
}
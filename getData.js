'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3()

module.exports.handler = async (event) => {
  try {
    const file = await s3.getObject({
      Bucket: process.env.BUCKET,
      Key: `${event.pathParameters.id}.txt`
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({message: file.Body.toString()})
    }
  } catch(err) {
    console.log(err)
  }
}
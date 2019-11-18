'use strict'

const aws = require('aws-sdk')
const s3 = new aws.S3()

module.exports.handler = async (event) => {
  try {
    const list = await s3.listObjects({
      Bucket: process.env.BUCKET
    }).promise()

    const fileList = list.Contents.map(file => {
      return file.Key
    })

    return {
      statusCode: 200,
      body: JSON.stringify({fileList: fileList})
    }
  } catch(err) {
    console.log(err)
  }
}
'use strict'

const { Client } = require('pg')
const { createTable } = require('./common/createTable')

module.exports.handler = async (event) => {
    try{
        const client = new Client({
            host: process.env.POSTGRE_HOST,
            port: process.env.POSTGRE_PORT,
            user: process.env.POSTGRE_USERNAME,
            password: process.env.POSTGRE_PASSWORD
        })

        await client.connect()
        const data = await client.query(`
            SELECT * FROM test
        `)
        
        client.end()
        if(data.rows[0]){
            return {
                statusCode: 200,
                body: JSON.stringify({result: data.rows})
            }
        }else
            throw new Error('Not found')
    } catch(err) {
        console.log(err)
        return {
            statusCode: err.statusCode || 404,
            body: JSON.stringify({message: err.message || `Not found`})
        }
    }
}
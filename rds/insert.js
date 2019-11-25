'use strict'

const { Client } = require('pg')
const { createTable } = require('./common/createTable')

module.exports.handler = async (event) => {
    try{
        const body = JSON.parse(event.body)
        const client = new Client({
            host: process.env.POSTGRE_HOST,
            port: process.env.POSTGRE_PORT,
            database: process.env.POSTGRE_DATABASE,
            user: process.env.POSTGRE_USER,
            password: process.env.POSTGRE_PASSWORD
        })

        client.connect()
        await createTable(client)

        const data = await client.query(`
            INSERT INTO test VALUES ($1::varchar)
        `, [body.message])

        if(data.rows[0]){
            return {
                statusCode: 301,
                body: JSON.stringify({message: `Successfully created`, result: data.rows[0]})
            }
        }else
            throw err
    } catch(err) {
        console.log(err)
        return {
            statusCode: err.statusCode || 501,
            body: JSON.stringify({message: err.message || `Failed to insert`})
        }
    }
}
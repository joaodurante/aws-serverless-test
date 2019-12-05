'use strict'

const { Client } = require('pg')

module.exports.handler = async (event) => {
    try{
        const body = JSON.parse(event.body)
        const client = new Client({
            host: process.env.POSTGRE_HOST,
            port: process.env.POSTGRE_PORT,
            user: process.env.POSTGRE_USERNAME,
            password: process.env.POSTGRE_PASSWORD
        })
        await client.connect()

        const data = await client.query(
            'INSERT INTO test(message) VALUES ($1::varchar) RETURNING *',
            [body.message]
        )
        
        client.end()
        if(data.rows[0]){
            return {
                statusCode: 201,
                body: JSON.stringify({message: 'Successfully created', result: data.rows[0]})
            }
        }else
            throw new Error('Failed to insert')
    } catch(err) {
        console.log(err)
        return {
            statusCode: err.statusCode || 501,
            body: JSON.stringify({message: err.message || 'Failed to insert'})
        }
    }
}
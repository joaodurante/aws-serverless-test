'use strict'

const { Client } = require('pg')

module.exports.handler = async (event) => {
    try {
        const client = new Client({
            host: process.env.POSTGRE_HOST,
            port: process.env.POSTGRE_PORT,
            user: process.env.POSTGRE_USERNAME,
            password: process.env.POSTGRE_PASSWORD
        })

        await client.connect()

        await client.query(
            'DELETE FROM test WHERE id = $1',
            [event.pathParameters.id]
        )

        return {
            statusCode: 204,
            body: JSON.stringify({message: 'Successfully deleted'})
        }
    } catch(err){
        console.log(err)
        return {
            statusCode: 404,
            body: JSON.stringify({message: err.message || 'Failed to delete'})
        }
    }
}
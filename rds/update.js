'use strict'

const { Client } = require('pg')

module.exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body)
        const client = new Client({
            host: process.env.POSTGRE_HOST,
            port: process.env.POSTGRE_PORT,
            user: process.env.POSTGRE_USERNAME,
            password: process.env.POSTGRE_PASSWORD
        })

        await client.connect()

        if(!body.message)
            throw new Error('Missing statements')
        
        const newData = await client.query(
            'UPDATE test SET message = $1::varchar WHERE id = $2 RETURNING *',
            [body.message, event.pathParameters.id]
        )

        if(newData.rows[0]){
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Successfully updated', result: newData.rows[0]})
            }
        }else
            throw new Error('Failed to update')
    } catch(err) {
        console.log(err)
        return {
            statusCode: err.statusCode || 501,
            body: JSON.stringify({message: err.message || 'Failed to update'})
        }
    }
}
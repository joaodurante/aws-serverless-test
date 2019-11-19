const { createTable } = require('./common/createTable')
const { initClient } = require('./common/initClient')

module.exports.insert = async (event) => {
    try {
        const client = initClient()
        const data = JSON.parse(event.Body)
        client.connect()

        if(!data.message)
            throw err

        await createTable()
        let data = await client.query(`
            INSERT INTO test(message)
            VALUES ($1) RETURNING id
        `, [data.message]).promise()

        if(data.rows[0]){
            return {
                statusCode: 301,
                body: JSON.stringify({message: `Successfully created with id: ${data.rows[0].id}`})
            }
        }else{
            throw err
        }
    } catch(err) {
        return {
            statusCode: err.statusCode || 400,
            body: JSON.stringify({message: err.message || `Failed to insert`}),
            error: err
        }
    }
}

const { createTable } = require('./common/createTable')
const { initClient } = require('./common/initClient')

module.exports.insert = async (event) => {
    try {
        const client = initClient()
        const data = JSON.parse(event.Body)
        client.connect()

        await createTable()
        let data = await client.query(`
            SELECT * FROM test
        `).promise()

        if(data.rows[0]){
            return {
                statusCode: 200,
                body: JSON.stringify(data.rows)
            }
        }else{
            throw err
        }
    } catch(err) {
        return {
            statusCode: err.statusCode || 404,
            body: JSON.stringify({message: err.message || `Failed to fetch`}),
            error: err
        }
    }
}

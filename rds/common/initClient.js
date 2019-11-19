const { Client } = require('pg')

module.exports.initClient = () => {
    return new Client({
        host: process.env.POSTGRE_HOST,
        port: process.env.POSTGRE_PORT,
        database: process.env.POSTGRE_DATABASE,
        user: process.env.POSTGRE_USER,
        password: process.env.POSTGRE_PASSWORD
    })
}
module.exports.createTable = (client) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS test(
            id SERIAL NOT NULL PRIMARY KEY,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            message VARCHAR(100) NOT NULL
        )
    `)
}
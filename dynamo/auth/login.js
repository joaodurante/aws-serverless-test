const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient()

/**
 * Recebe username e password do BODY, verifica e retorna o token JWT gerado
 * - Busca o usuário
 * - Confirma a senha
 * - Gera o token
 */
module.exports.handler = async (event) => {
    const data = JSON.parse(event.body)
    if(!data.username || !data.password)
        throw new Error('Usuário ou senha inválidos')

    try {
        const user = await db.get({
            TableName: 'users',
            Key: {
                username: data.username
            }
        }).promise()

        if(user.Item){
            const match = await bcrypt.compare(data.password, user.Item.password)

            if(!match)
                throw new Error('Usuário ou senha inválidos')

            const token = await jwt.sign(
                { user: user.Item.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION_TIME }
            )

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    token: token
                })
            }
        }else
            throw new Error('Usuário ou senha inválidas')

    } catch(err) {
        console.log(err)
        return {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: err.message || 'error'
            })
        }
    }
}
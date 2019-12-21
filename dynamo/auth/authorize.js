const jwt = require('jsonwebtoken')


// Constroi IAMPolicy para permitir ou não o recurso para o usuário
const buildPolicy = (userId, effect, resource, context) => {
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        },
        context
    }
}

// Verifica o token recebido pelo header (Autorization) e retorna buildPolicy
module.exports.handler = async (event) => {
    const token = event.authorizationToken

    if(!token)
        throw new Error('Token inválido')

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        const { user } = decoded
        const authorizerContext = { user: JSON.stringify(user) }

        return buildPolicy(user.id, 'Allow', event.methodArn, authorizerContext)

    } catch(err) {
        console.log(err)
        return {
            statusCode: 401,
            body: JSON.stringify({message: err.message})
        }
    }
}
  
  
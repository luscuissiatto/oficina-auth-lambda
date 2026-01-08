const jwt = require('jsonwebtoken');
const { Client } = require('pg'); 

exports.handler = async (event) => {
    let dbClient;
    
    try {
        if (!event.body) {
             return { statusCode: 400, body: JSON.stringify({ message: "Body vazio" }) };
        }
        
        const body = JSON.parse(event.body);
        const cpf = body.cpf;

        if (!cpf) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "CPF é obrigatório" })
            };
        }

        dbClient = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: 5432,
            ssl: { rejectUnauthorized: false }
        });

        await dbClient.connect();

        const query = 'SELECT id FROM clients WHERE document = $1';
        const res = await dbClient.query(query, [cpf]);

        if (res.rows.length === 0) {
            await dbClient.end();
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "CPF não cadastrado. Faça o cadastro primeiro." })
            };
        }

        await dbClient.end();

        const secret = process.env.JWT_SECRET || "minha-chave-secreta-super-segura";
        
        const token = jwt.sign({ 
            sub: cpf,
            roles: ['ROLE_CLIENT'],
            authorities: ['ROLE_CLIENT'],
            iss: "oficina-auth"
        }, secret, { 
            expiresIn: '1h' 
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                token: token,
                type: "Bearer",
                expiresIn: 3600
            })
        };

    } catch (error) {
        console.error("Erro na Lambda:", error);
        if (dbClient) {
            await dbClient.end();
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro interno ao validar usuário", error: error.message })
        };
    }
};
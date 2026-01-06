const jwt = require('jsonwebtoken');
// const { Client } = require('pg'); // Descomentar para conectar no banco real

exports.handler = async (event) => {
    try {
        // 1. Receber o CPF do corpo da requisição
        const body = JSON.parse(event.body);
        const cpf = body.cpf;

        if (!cpf) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "CPF é obrigatório" })
            };
        }

        // 2. Validação do CPF (Aqui conectaria no Banco de Dados para ver se existe)
        // Para o MVP inicial, vamos simular que qualquer CPF válido loga.
        // TODO: Adicionar conexão com RDS para verificar se CPF existe na tabela 'clients'
        
        const userIsValid = true; // Simulação

        if (!userIsValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "CPF não cadastrado" })
            };
        }

        // 3. Gerar o Token JWT
        // IMPORTANTE: A SECRET deve ser a mesma usada no Java Spring depois!
        const secret = process.env.JWT_SECRET || "minha-chave-secreta-super-segura";
        
        const token = jwt.sign({ 
            sub: cpf, 
            role: 'CLIENT' 
        }, secret, { 
            expiresIn: '1h' 
        });

        // 4. Retornar o Token
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                token: token,
                type: "Bearer",
                expiresIn: 3600
            })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro interno no servidor de autenticação" })
        };
    }
};
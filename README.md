# ⚡ Oficina Mecânica - Autenticação Serverless

## 📋 Sobre o Projeto
Este repositório contém a função **Serverless (AWS Lambda)** responsável pela autenticação centralizada do sistema "Oficina Mecânica".

Para garantir escalabilidade e desacoplamento, o login não é processado pela API principal. Esta função recebe o CPF do cliente, valida sua existência no banco de dados compartilhado (RDS) e emite um **Token JWT (JSON Web Token)** assinado. Este token é o passaporte para acessar as rotas protegidas do Backend.

## 🚀 Tecnologias Utilizadas
* **Runtime:** Node.js 18.x
* **Cloud:** AWS Lambda & AWS API Gateway
* **Banco de Dados:** Biblioteca `pg` (PostgreSQL Client)
* **Segurança:** Biblioteca `jsonwebtoken` (Assinatura HS256)
* **CI/CD:** GitHub Actions

## 🏗️ Arquitetura e Fluxo
O fluxo segue o padrão de validação direta no banco e geração de token assinado.

![Arquitetura Auth]([INSIRA O LINK DO DIAGRAMA MERMAID AQUI])

**Fluxo de Execução:**
1. Cliente envia POST com CPF.
2. Lambda conecta no RDS (PostgreSQL).
3. Se o cliente existe, gera Token JWT com validade de 1 hora.
4. Retorna o Token para o cliente usar no Header `Authorization`.

## ⚙️ Como Rodar Localmente (Passo a Passo)

### Pré-requisitos
* **Node.js** (v18 ou superior) instalado.
* Acesso ao banco de dados (Local ou RDS).

### 1. Instalar Dependências
Na raiz do projeto, instale as bibliotecas necessárias:

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie as variáveis de ambiente simulando o ambiente da AWS (Linux/Mac):

```bash
export DB_HOST=localhost
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=oficina
export JWT_SECRET=minha-chave-secreta-super-segura
```

### 3. Testar a Função
Você pode executar o arquivo index.js localmente. Crie um arquivo de teste simples ou execute via node se tiver adaptado a chamada:

```bash
node index.js
```

### ☁️ Deploy e CI/CD
O repositório conta com uma pipeline de CI/CD via GitHub Actions configurada para automatizar o deploy na AWS.

**Passos do Pipeline:**

1. Checkout: Baixa o código.
2. Install: Instala dependências de produção (npm ci --production).
3. Zip: Empacota o código fonte index.js e a pasta node_modules.
4. Deploy: Usa o AWS CLI para atualizar o código da função Lambda:

```bash
aws lambda update-function-code --function-name oficina-auth --zip-file fileb://deploy_package.zip
```

### 🔗 Testando a API
Após o deploy, a autenticação pode ser testada via Curl ou Postman:

```bash
curl -X POST https://<API_GATEWAY_URL>/auth \
     -H "Content-Type: application/json" \
     -d '{"cpf": "12345678900"}'
```

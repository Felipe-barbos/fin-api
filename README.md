# ignite-desafio-test-challenge 🚀

## 1. Sobre o desafio 📄

Este desafio consiste na implementação dos teste unitários e de integração em uma API, 
disponibilizada pela Rocketseat.

## 2. Como rodar o desafio 🔧

Basta seguir esse passo a passo:

```
git clone <https://github.com/Felipe-barbos/ignite-desafio-test-challenge.git>
cd ignite-desafio-test-challenge
yarn
docker-compose up
```

OBS: para a aplicação funcionar corretamente o mesmo deverá ter o DOCKER instalado no dispositivo, 
e verificar os dados de autenticação do banco de dados ```ormconfig.json``` e o ```index.js```  arquivo de configuração do typeorm, deve-se criar um banco de 
dados para testes.

## 3. Rotas e suas funcionalidades ⚙️

### POST /api/v1/users

A rota recebe name, email e password dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status 201

exemplo de instanciamento passando no request.body:
```js 
{
"name": "Felipe Barbosa"
"email": "felipe@gmail.com"
"password": "1234345"
}

```

### POST /api/v1/sessions

A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.

exemplo de instanciamento passando no request.body:
```js 
{
"email": "felipe@gmail.com"
"password": "1234345"
}

```

### GET /api/v1/profile

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

### GET /api/v1/statements/balance

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

### POST /api/v1/statements/deposit

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

exemplo de instanciamento passando no request.body:
```js 
{
"amount": 900
"description": "Depósito teste"
}

```

### POST /api/v1/statements/withdraw

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`. 

exemplo de instanciamento passando no request.body:
```js 
{
"amount": 300
"description": "Saque de teste"
}

```

### GET /api/v1/statements/:statement_id

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota (route params) e retorna as informações da operação encontrada.







# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas
* Node.js
* Express.js
* PostgreSQL
* dotenv
* cors

## Integrantes
* Pedro Veiga Oliveira

## Instalação
Clone o repositório:
git clone https://github.com/PedroVeiga-Oliveira/api-campo-minado.git

Acesse a pasta do projeto:
cd api-campo-minado

Instale as dependências:
npm install

## Configuração
Crie um arquivo .env na raiz do projeto:
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=3000
NODE_ENV=development

## Executando a aplicação
npm run dev

A API estará disponível em:
http://localhost:3000

## Endpoints
### Cadastro de usuário
POST /auth/register

### Login
POST /auth/login

### Iniciar jogo
POST /games/start

### Revelar posição
POST /games/{gameId}/reveal

### Sacar prêmio
POST /games/{gameId}/cashout
# Cadastro - Exemplo Node.js + MySQL

Projeto de exemplo que contém:

- APIs REST para CRUD de usuários (/api/users)
- Front-end simples em `public/index.html` para cadastrar e listar alunos
- Script SQL em `db/init.sql` para criar o banco e a tabela

Pré-requisitos
- Node.js (v14+)
- MySQL rodando localmente

Configuração rápida

1. Abra o MySQL como root e execute o script SQL:

   mysql -u root -p < db/init.sql

   (Se sua instância root não tiver senha, apenas pressione Enter quando solicitado.)

2. Instale dependências e rode o servidor:

   npm install
   npm start

3. Abra no navegador: http://localhost:3000

Alterar credenciais

Se seu usuário/senha/host do MySQL não for `root` e senha vazia, use variáveis de ambiente:

  set DB_HOST=seu_host; set DB_USER=seu_usuario; set DB_PASS=sua_senha; set DB_NAME=seu_banco
  npm start

APIs fornecidas

- GET /api/users - lista todos
- GET /api/users/:id - obter por id
- POST /api/users - criar { nome, email, telefone }
- PUT /api/users/:id - atualizar { nome, email, telefone }
- DELETE /api/users/:id - excluir

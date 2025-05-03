# 🛡️ Autenticação com Node.js, Express e MongoDB

Este é um projeto backend desenvolvido em Node.js utilizando Express, MongoDB (via Mongoose) e autenticação baseada em tokens JWT. A aplicação segue a arquitetura em camadas, com organização de responsabilidades por diretórios.

## 📁 Estrutura de Pastas

```
src/
├── controllers/    # Lógica das rotas
├── services/       # Lógica de negócio
├── models/         # Modelos Mongoose
├── routes/         # Definição das rotas
├── middlewares/    # Middlewares de autenticação e tratamento
├── database/       # Conexão com o MongoDB
├── server.js       # Ponto de entrada da aplicação
requests/           # Scripts .sh com testes usando curl
```

## 🚀 Funcionalidades

### Rotas Públicas

- `POST /register`: Cadastra um novo usuário no sistema.
- `POST /login`: Autentica um usuário e retorna um token JWT.

### Rotas Protegidas

- `GET /protected`: Recurso protegido, acessível apenas com um token JWT válido no cabeçalho `Authorization`.

## ✅ Validações

- **E-mail**: obrigatório, formato válido, único no sistema.
- **Senha**: obrigatória, mínimo de 6 caracteres.
- **Campos ausentes ou inválidos** retornam erros apropriados com status HTTP corretos.

## 🔐 Segurança

- As senhas são armazenadas como hash usando `bcrypt`.
- O token JWT é assinado com uma chave secreta segura (armazenada em variável de ambiente).
- Requisições protegidas só são acessadas com um JWT válido.

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<senha>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=sua_chave_jwt_segura
```

## 🧪 Testes via Curl

No diretório `requests/`, você encontrará scripts `.sh` com exemplos de requisições:

```bash
chmod +x requests/**/*.sh  # Deixe os arquivos executáveis (caso necessário)

# Registro bem-sucedido
./requests/register/register_success.sh

# Login bem-sucedido
./requests/login/login_success.sh

# Acesso protegido com token válido
./requests/protected/protected_valid_token.sh
```

## 🖥️ Execução no GitHub Codespace

1. Clone o projeto para seu Codespace.
2. Instale as dependências:
   
   npm install
   
3. Inicie a aplicação:
   
   npm run dev
   
4. Acesse via Thunder Client, curl ou Postman na URL:
   
   http://localhost:5000
  

## 📎 Demonstração

[Link para o vídeo de demonstração](https://drive.google.com/file/d/1nl5ZksTQEf0zrrUm8KXUMXlECaQh6na9/view?usp=sharing)

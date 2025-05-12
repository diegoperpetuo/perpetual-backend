# Movies CRUD API com Autenticação JWT

Esta é uma API Node.js com Express e MongoDB que permite a criação, leitura, atualização e exclusão de filmes. A API está protegida com autenticação JWT, garantindo que cada usuário só possa acessar seus próprios dados.

## Funcionalidades

- Cadastro e login de usuários
- Autenticação via JWT
- CRUD completo de filmes:
  - Criar um filme
  - Listar todos os filmes do usuário
  - Ver detalhes de um filme específico
  - Atualizar completamente ou parcialmente um filme
  - Remover um filme

## Rotas

### Autenticação

- `POST /auth/register` — Cria um novo usuário
- `POST /auth/login` — Realiza login e retorna um token JWT

### Filmes (Protegido por JWT)

Todas as rotas abaixo exigem o cabeçalho:
```http
Authorization: Bearer SEU_TOKEN_AQUI
```

- `POST /movies` — Cria um novo filme
- `GET /movies` — Lista todos os filmes do usuário autenticado
- `GET /movies/:id` — Retorna os detalhes de um filme específico
- `PUT /movies/:id` — Atualiza completamente os dados de um filme
- `PATCH /movies/:id` — Atualiza parcialmente os dados de um filme
- `DELETE /movies/:id` — Remove um filme

## Exemplo de Requisição `curl`

```bash
curl -X POST https://SEU_DOMINIO.vercel.app/api/movies \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-d '{
  "title": "Matrix",
  "genre": "Sci-Fi",
  "releaseYear": 1999,
  "rating": 9.0
}'
```

## Executando Localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` com as seguintes variáveis:
   ```env
   MONGO_URI=seu_mongodb_uri
   JWT_SECRET=sua_chave_secreta
   PORT=5000
   ```
4. Execute o servidor:
   ```bash
   npm run dev
   ```

---
  
## 📎 Demonstração

[Link para o vídeo de demonstração](https://drive.google.com/file/d/1rB-zMLo4DGOKWw1P-p_Njpf4cQwlly_X/view?usp=sharing)

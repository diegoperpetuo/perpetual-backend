# Perpetual Backend

Backend da aplicação Perpetual, uma plataforma de filmes e séries com sistema de comentários.

## Funcionalidades

- **Autenticação**: Registro e login de usuários com JWT
- **Filmes**: CRUD completo de filmes
- **Usuários**: Gerenciamento de perfis de usuários
- **Comentários**: Sistema completo de comentários para filmes e séries
- **TMDB Proxy**: Proxy seguro para a API TMDB (filmes e séries)

## Tecnologias

- Node.js
- Express.js
- MongoDB com Mongoose
- JWT para autenticação
- Jest para testes
- Swagger para documentação
- Axios para requisições HTTP

## Estrutura do Projeto

```
src/
├── controllers/          # Controladores da aplicação
│   ├── authController.js
│   ├── commentController.js
│   ├── movieController.js
│   ├── tmdbController.js
│   └── userController.js
├── models/              # Modelos do MongoDB
│   ├── Comment.js
│   ├── Movie.js
│   └── User.js
├── routes/              # Rotas da aplicação
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── movie.js
│   ├── tmdbRoutes.js
│   └── userRoutes.js
├── services/            # Lógica de negócio
│   ├── authService.js
│   ├── commentService.js
│   ├── movieService.js
│   └── tmdbService.js
├── middlewares/         # Middlewares
│   ├── auth.js
│   └── authMiddleware.js
├── database/            # Configuração do banco
│   └── connection.js
└── index.js            # Arquivo principal
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env`:
```env
MONGO_URI=sua_uri_do_mongodb
JWT_SECRET=seu_jwt_secret
PORT=5000
TMDB_API_KEY=sua_chave_da_api_tmdb
NODE_ENV=development
```

**Importante**: A `TMDB_API_KEY` é obrigatória para as funcionalidades de filmes e séries. Obtenha sua chave gratuita em [TMDB](https://www.themoviedb.org/settings/api).

4. Execute o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## API Endpoints

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login
- `GET /auth/protected` - Rota protegida (teste)

### Filmes
- `GET /movies` - Listar filmes
- `POST /movies` - Criar filme
- `GET /movies/:id` - Buscar filme por ID
- `PUT /movies/:id` - Atualizar filme
- `DELETE /movies/:id` - Deletar filme

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Comentários
- `GET /api/comments` - Buscar comentários por tmdbId e mediaType
- `POST /api/comments` - Criar comentário (autenticado)
- `PUT /api/comments/:id` - Atualizar comentário (autenticado)
- `DELETE /api/comments/:id` - Deletar comentário (autenticado)
- `GET /api/comments/user/:userId` - Buscar comentários de um usuário

### TMDB Proxy (Seguro)
- `GET /api/tmdb/movies/popular` - Filmes populares
- `GET /api/tmdb/movies/now-playing` - Filmes em cartaz
- `GET /api/tmdb/movies/trending` - Filmes em tendência
- `GET /api/tmdb/tv/popular` - Séries populares
- `GET /api/tmdb/movie/:id` - Detalhes de filme
- `GET /api/tmdb/tv/:id` - Detalhes de série
- `GET /api/tmdb/genres` - Todos os gêneros
- `GET /api/tmdb/search/multi` - Busca múltipla
- `GET /api/tmdb/search/movie` - Busca filmes
- `GET /api/tmdb/search/tv` - Busca séries
- `GET /api/tmdb/:mediaType/:id` - Detalhes genéricos
- `POST /api/tmdb/multiple` - Buscar múltiplos itens

## Sistema de Comentários

O sistema de comentários permite que usuários autenticados:

- **Criar comentários** sobre filmes e séries usando o tmdbId
- **Visualizar comentários** de qualquer filme/série (sem autenticação)
- **Editar seus próprios comentários**
- **Deletar seus próprios comentários**
- **Buscar comentários por usuário**

### Estrutura do Comentário
```json
{
  "_id": "comment_id",
  "userId": {
    "_id": "user_id",
    "name": "Nome do Usuário",
    "email": "email@example.com"
  },
  "username": "Nome do Usuário",
  "tmdbId": 550,
  "mediaType": "movie",
  "text": "Texto do comentário",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Validações
- Texto obrigatório, máximo 500 caracteres
- tmdbId e mediaType obrigatórios
- mediaType deve ser "movie" ou "tv"
- Apenas o autor pode editar/deletar seus comentários

## Proxy TMDB Seguro

O backend atua como um proxy seguro para a API TMDB, mantendo a chave da API protegida no servidor:

### Vantagens de Segurança:
- ✅ **Chave da API protegida** - Não exposta no frontend
- ✅ **Rate limiting** - Controle de requisições no servidor
- ✅ **Cache** - Possibilidade de implementar cache
- ✅ **Logs** - Monitoramento de requisições
- ✅ **Validação** - Validação de parâmetros no servidor

### Como funciona:
1. Frontend faz requisição para `/api/tmdb/*`
2. Backend valida a requisição
3. Backend faz requisição para TMDB com a chave
4. Backend retorna os dados para o frontend

## Testes

Execute os testes:
```bash
npm test
```

### Testes de Comentários
- Testes unitários do service: `tests/unit/services/commentService.test.js`
- Testes de integração das rotas: `tests/unit/integration/commentRoutes.test.js`

## Scripts de Teste

### Linux/Mac
```bash
# Teste completo
./test_comments.sh

# Testes individuais
./requests/comments/create_comment.sh
./requests/comments/get_comments.sh
./requests/comments/update_comment.sh
./requests/comments/delete_comment.sh
```

### Windows
```bash
# Teste básico
test_comments.bat
```

## Documentação

- [Documentação da API de Comentários](COMMENTS_API.md)
- Swagger UI disponível em `/api-docs` (quando configurado)

## Desenvolvimento

### Adicionando Novas Funcionalidades

1. Crie o modelo em `src/models/`
2. Implemente o service em `src/services/`
3. Crie o controller em `src/controllers/`
4. Defina as rotas em `src/routes/`
5. Adicione as rotas no `src/index.js`
6. Crie testes unitários e de integração
7. Documente a API

### Padrões de Código

- Use async/await para operações assíncronas
- Implemente validações no service
- Use try/catch para tratamento de erros
- Mantenha controllers simples, delegando lógica para services
- Use middlewares para autenticação e validação

## Deploy

O projeto está configurado para deploy no Vercel com o arquivo `vercel.json`.

**Importante para deploy**: Configure a variável `TMDB_API_KEY` no seu provedor de deploy.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Adicione testes
5. Faça commit das mudanças
6. Abra um Pull Request

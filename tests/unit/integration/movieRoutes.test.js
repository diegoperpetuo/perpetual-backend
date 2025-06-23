// perpetual-project/perpetual-backend/tests/integration/movieRoutes.test.js
const request = require('supertest');
const express = require('express');
const movieRoutes = require('../../../src/routes/movie');
const movieService = require('../../../src/services/movieService');

// Mock the movieService
jest.mock('../../../src/services/movieService');

// Mock the auth middleware (the routes use authMiddleware)
jest.mock('../../../src/middlewares/authMiddleware', () => jest.fn((req, res, next) => {
  req.user = { id: 'mockUserIdForMovieRoutes' };
  next();
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/movies', movieRoutes);

describe('Movie Routes', () => {
  const mockMovie = {
    _id: 'mockMovieId123',
    title: 'Inception',
    genre: 'Sci-Fi',
    releaseYear: 2010,
    rating: 8.8,
    owner: 'mockUserIdForMovieRoutes'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /movies', () => {
    it('deve criar um filme e retornar 201', async () => {
      const moviePayload = { title: 'New Movie', genre: 'Action', releaseYear: 2023, rating: 8 };
      movieService.create.mockResolvedValue({ ...mockMovie, ...moviePayload });
      
      const res = await request(app)
        .post('/movies')
        .set('Authorization', 'Bearer mockToken')
        .send(moviePayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(moviePayload.title);
      expect(movieService.create).toHaveBeenCalledWith(moviePayload, 'mockUserIdForMovieRoutes');
    });

    it('deve retornar 400 se o título estiver faltando', async () => {
      const res = await request(app)
        .post('/movies')
        .set('Authorization', 'Bearer mockToken')
        .send({ genre: 'Test' }); // Sem título

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Título é obrigatório');
    });
  });

  describe('GET /movies', () => {
    it('deve retornar uma lista de filmes e status 200', async () => {
      const mockMovieList = [mockMovie];
      movieService.getAllByUser.mockResolvedValue(mockMovieList);
      
      const res = await request(app)
        .get('/movies')
        .set('Authorization', 'Bearer mockToken');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockMovieList);
      expect(movieService.getAllByUser).toHaveBeenCalledWith('mockUserIdForMovieRoutes');
    });
  });

  describe('GET /movies/:id', () => {
    it('deve retornar um filme específico e status 200', async () => {
      movieService.getByIdAndUser.mockResolvedValue(mockMovie);
      
      const res = await request(app)
        .get(`/movies/${mockMovie._id}`)
        .set('Authorization', 'Bearer mockToken');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockMovie);
      expect(movieService.getByIdAndUser).toHaveBeenCalledWith(mockMovie._id, 'mockUserIdForMovieRoutes');
    });

    it('deve retornar 404 se o filme não for encontrado', async () => {
      movieService.getByIdAndUser.mockResolvedValue(null);
      
      const res = await request(app)
        .get('/movies/nonexistentid')
        .set('Authorization', 'Bearer mockToken');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Filme não encontrado');
    });
  });

  describe('PUT /movies/:id', () => {
    it('deve atualizar um filme e retornar 200', async () => {
      const updatedData = { title: 'Inception Updated' };
      movieService.updateByIdAndUser.mockResolvedValue({ ...mockMovie, ...updatedData });
      
      const res = await request(app)
        .put(`/movies/${mockMovie._id}`)
        .set('Authorization', 'Bearer mockToken')
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Inception Updated');
      expect(movieService.updateByIdAndUser).toHaveBeenCalledWith(mockMovie._id, 'mockUserIdForMovieRoutes', updatedData);
    });
  });

  describe('PATCH /movies/:id', () => {
    it('deve atualizar parcialmente um filme e retornar 200', async () => {
      const partialData = { rating: 10 };
      movieService.partialUpdateByIdAndUser.mockResolvedValue({ ...mockMovie, ...partialData });
      
      const res = await request(app)
        .patch(`/movies/${mockMovie._id}`)
        .set('Authorization', 'Bearer mockToken')
        .send(partialData);

      expect(res.statusCode).toBe(200);
      expect(res.body.rating).toBe(10);
      expect(movieService.partialUpdateByIdAndUser).toHaveBeenCalledWith(mockMovie._id, 'mockUserIdForMovieRoutes', partialData);
    });
  });

  describe('DELETE /movies/:id', () => {
    it('deve deletar um filme e retornar 200 com mensagem', async () => {
      movieService.deleteByIdAndUser.mockResolvedValue(mockMovie);
      
      const res = await request(app)
        .delete(`/movies/${mockMovie._id}`)
        .set('Authorization', 'Bearer mockToken');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Filme excluído com sucesso');
      expect(movieService.deleteByIdAndUser).toHaveBeenCalledWith(mockMovie._id, 'mockUserIdForMovieRoutes');
    });

    it('deve retornar 404 se o filme a ser deletado não for encontrado', async () => {
      movieService.deleteByIdAndUser.mockResolvedValue(null);
      
      const res = await request(app)
        .delete('/movies/nonexistentidfordelete')
        .set('Authorization', 'Bearer mockToken');

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Filme não encontrado');
    });
  });
});
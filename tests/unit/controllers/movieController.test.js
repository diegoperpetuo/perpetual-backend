const movieController = require('../../../src/controllers/movieController');
const movieService = require('../../../src/services/movieService');

// Mock the movieService
jest.mock('../../../src/services/movieService');

describe('MovieController', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson
    };
    mockReq = {
      body: {},
      params: {},
      user: { id: 'mock-user-id' }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should create a movie successfully', async () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 8
      };
      mockReq.body = movieData;

      const expectedMovie = { id: 'movie-id', ...movieData };
      movieService.create.mockResolvedValue(expectedMovie);

      await movieController.createMovie(mockReq, mockRes);

      expect(movieService.create).toHaveBeenCalledWith(movieData, 'mock-user-id');
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(expectedMovie);
    });

    it('should return 400 when title is missing', async () => {
      const movieData = {
        genre: 'Action',
        releaseYear: 2023,
        rating: 8
      };
      mockReq.body = movieData;

      await movieController.createMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Título é obrigatório' });
    });

    it('should handle server error', async () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 8
      };
      mockReq.body = movieData;

      movieService.create.mockRejectedValue(new Error('Database error'));

      await movieController.createMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao criar filme' });
    });
  });

  describe('getMovies', () => {
    it('should get all movies for user successfully', async () => {
      const expectedMovies = [
        { id: '1', title: 'Movie 1' },
        { id: '2', title: 'Movie 2' }
      ];
      movieService.getAllByUser.mockResolvedValue(expectedMovies);

      await movieController.getMovies(mockReq, mockRes);

      expect(movieService.getAllByUser).toHaveBeenCalledWith('mock-user-id');
      expect(mockJson).toHaveBeenCalledWith(expectedMovies);
    });

    it('should handle server error', async () => {
      movieService.getAllByUser.mockRejectedValue(new Error('Database error'));

      await movieController.getMovies(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar filmes' });
    });
  });

  describe('getMovieById', () => {
    it('should get a movie by id successfully', async () => {
      const movieId = 'movie-id';
      mockReq.params = { id: movieId };

      const expectedMovie = { id: movieId, title: 'Test Movie' };
      movieService.getByIdAndUser.mockResolvedValue(expectedMovie);

      await movieController.getMovieById(mockReq, mockRes);

      expect(movieService.getByIdAndUser).toHaveBeenCalledWith(movieId, 'mock-user-id');
      expect(mockJson).toHaveBeenCalledWith(expectedMovie);
    });

    it('should return 404 when movie is not found', async () => {
      const movieId = 'movie-id';
      mockReq.params = { id: movieId };

      movieService.getByIdAndUser.mockResolvedValue(null);

      await movieController.getMovieById(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
    });

    it('should handle server error', async () => {
      const movieId = 'movie-id';
      mockReq.params = { id: movieId };

      movieService.getByIdAndUser.mockRejectedValue(new Error('Database error'));

      await movieController.getMovieById(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar filme' });
    });
  });

  describe('updateMovie', () => {
    it('should update a movie successfully', async () => {
      const movieId = 'movie-id';
      const updateData = { title: 'Updated Movie', rating: 9 };
      mockReq.params = { id: movieId };
      mockReq.body = updateData;

      const expectedMovie = { id: movieId, ...updateData };
      movieService.updateByIdAndUser.mockResolvedValue(expectedMovie);

      await movieController.updateMovie(mockReq, mockRes);

      expect(movieService.updateByIdAndUser).toHaveBeenCalledWith(movieId, 'mock-user-id', updateData);
      expect(mockJson).toHaveBeenCalledWith(expectedMovie);
    });

    it('should return 404 when movie is not found', async () => {
      const movieId = 'movie-id';
      const updateData = { title: 'Updated Movie' };
      mockReq.params = { id: movieId };
      mockReq.body = updateData;

      movieService.updateByIdAndUser.mockResolvedValue(null);

      await movieController.updateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
    });

    it('should handle server error', async () => {
      const movieId = 'movie-id';
      const updateData = { title: 'Updated Movie' };
      mockReq.params = { id: movieId };
      mockReq.body = updateData;

      movieService.updateByIdAndUser.mockRejectedValue(new Error('Database error'));

      await movieController.updateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao atualizar filme' });
    });
  });

  describe('partialUpdateMovie', () => {
    it('should partially update a movie successfully', async () => {
      const movieId = 'movie-id';
      const updateData = { rating: 9 };
      mockReq.params = { id: movieId };
      mockReq.body = updateData;

      const expectedMovie = { id: movieId, title: 'Test Movie', rating: 9 };
      movieService.partialUpdateByIdAndUser.mockResolvedValue(expectedMovie);

      await movieController.partialUpdateMovie(mockReq, mockRes);

      expect(movieService.partialUpdateByIdAndUser).toHaveBeenCalledWith(movieId, 'mock-user-id', updateData);
      expect(mockJson).toHaveBeenCalledWith(expectedMovie);
    });

    it('should return 404 when movie is not found', async () => {
      const movieId = 'movie-id';
      const updateData = { rating: 9 };
      mockReq.params = { id: movieId };
      mockReq.body = updateData;

      movieService.partialUpdateByIdAndUser.mockResolvedValue(null);

      await movieController.partialUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
    });

    it('should handle server error', async () => {
      const movieId = 'movie-id';
      const updateData = { rating: 9 };
      mockReq.params = { id: movieId };
      mockReq.body = updateData;

      movieService.partialUpdateByIdAndUser.mockRejectedValue(new Error('Database error'));

      await movieController.partialUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao atualizar filme' });
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie successfully', async () => {
      const movieId = 'movie-id';
      mockReq.params = { id: movieId };

      movieService.deleteByIdAndUser.mockResolvedValue({ id: movieId });

      await movieController.deleteMovie(mockReq, mockRes);

      expect(movieService.deleteByIdAndUser).toHaveBeenCalledWith(movieId, 'mock-user-id');
      expect(mockJson).toHaveBeenCalledWith({ message: 'Filme excluído com sucesso' });
    });

    it('should return 404 when movie is not found', async () => {
      const movieId = 'movie-id';
      mockReq.params = { id: movieId };

      movieService.deleteByIdAndUser.mockResolvedValue(null);

      await movieController.deleteMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Filme não encontrado' });
    });

    it('should handle server error', async () => {
      const movieId = 'movie-id';
      mockReq.params = { id: movieId };

      movieService.deleteByIdAndUser.mockRejectedValue(new Error('Database error'));

      await movieController.deleteMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao excluir filme' });
    });
  });
}); 
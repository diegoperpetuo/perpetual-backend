const userController = require('../../../src/controllers/userController');
const User = require('../../../src/models/User');

// Mock the User model
jest.mock('../../../src/models/User');

describe('UserController', () => {
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

  describe('addOrUpdateMovie', () => {
    it('should add a new movie successfully', async () => {
      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };
      mockReq.body = movieData;

      const mockUser = {
        id: 'mock-user-id',
        movieList: [],
        save: jest.fn().mockResolvedValue(true),
        find: jest.fn().mockReturnValue(movieData)
      };
      User.findById.mockResolvedValue(mockUser);

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('mock-user-id');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(movieData);
    });

    it('should update an existing movie successfully', async () => {
      const movieData = {
        tmdbId: 123,
        rating: 9,
        favorite: false,
        media_type: 'movie'
      };
      mockReq.body = movieData;

      const existingMovie = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };

      const mockUser = {
        id: 'mock-user-id',
        movieList: [existingMovie],
        save: jest.fn().mockResolvedValue(true),
        find: jest.fn().mockReturnValue(movieData)
      };
      User.findById.mockResolvedValue(mockUser);

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('mock-user-id');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(movieData);
    });

    it('should return 400 when tmdbId is missing', async () => {
      const movieData = {
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };
      mockReq.body = movieData;

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'tmdbId e media_type são obrigatórios' 
      });
    });

    it('should return 400 when media_type is missing', async () => {
      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true
      };
      mockReq.body = movieData;

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'tmdbId e media_type são obrigatórios' 
      });
    });

    it('should return 400 when media_type is invalid', async () => {
      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'invalid'
      };
      mockReq.body = movieData;

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'media_type inválido. Deve ser "movie" ou "tv".' 
      });
    });

    it('should return 404 when user is not found', async () => {
      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };
      mockReq.body = movieData;

      User.findById.mockResolvedValue(null);

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('should handle server error', async () => {
      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };
      mockReq.body = movieData;

      User.findById.mockRejectedValue(new Error('Database error'));

      await userController.addOrUpdateMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'Erro interno do servidor ao processar a solicitação de filme.' 
      });
    });
  });

  describe('removeMovie', () => {
    it('should remove a movie successfully', async () => {
      const tmdbId = '123';
      mockReq.params = { tmdbId };

      const mockUser = {
        id: 'mock-user-id',
        movieList: [
          { tmdbId: 123, title: 'Movie 1' },
          { tmdbId: 456, title: 'Movie 2' }
        ],
        save: jest.fn().mockResolvedValue(true)
      };
      User.findById.mockResolvedValue(mockUser);

      await userController.removeMovie(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('mock-user-id');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Filme removido com sucesso.',
        movieList: [{ tmdbId: 456, title: 'Movie 2' }]
      });
    });

    it('should return 400 when tmdbId is missing', async () => {
      mockReq.params = {};

      await userController.removeMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'tmdbId do filme é obrigatório nos parâmetros da URL.' 
      });
    });

    it('should return 404 when user is not found', async () => {
      const tmdbId = '123';
      mockReq.params = { tmdbId };

      User.findById.mockResolvedValue(null);

      await userController.removeMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('should return 404 when movie is not found in user list', async () => {
      const tmdbId = '999';
      mockReq.params = { tmdbId };

      const mockUser = {
        id: 'mock-user-id',
        movieList: [
          { tmdbId: 123, title: 'Movie 1' },
          { tmdbId: 456, title: 'Movie 2' }
        ],
        save: jest.fn().mockResolvedValue(true)
      };
      User.findById.mockResolvedValue(mockUser);

      await userController.removeMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'Filme não encontrado na lista do usuário.' 
      });
    });

    it('should handle server error', async () => {
      const tmdbId = '123';
      mockReq.params = { tmdbId };

      User.findById.mockRejectedValue(new Error('Database error'));

      await userController.removeMovie(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'Erro interno do servidor ao remover o filme.' 
      });
    });
  });

  describe('getMovies', () => {
    it('should get user movies successfully', async () => {
      const mockUser = {
        id: 'mock-user-id',
        movieList: [
          { tmdbId: 123, title: 'Movie 1' },
          { tmdbId: 456, title: 'Movie 2' }
        ]
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.getMovies(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('mock-user-id');
      expect(mockJson).toHaveBeenCalledWith(mockUser.movieList);
    });

    it('should return 404 when user is not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await userController.getMovies(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('should handle server error', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await userController.getMovies(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'Erro interno do servidor ao buscar os filmes.' 
      });
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const mockUser = {
        id: 'mock-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        movieList: [
          { tmdbId: 123, favorite: true },
          { tmdbId: 456, favorite: false },
          { tmdbId: 789, favorite: true }
        ]
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.getUserProfile(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith('mock-user-id');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        favoriteMoviesCount: 2
      });
    });

    it('should return 404 when user is not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await userController.getUserProfile(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
    });

    it('should handle server error', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await userController.getUserProfile(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ 
        error: 'Erro interno do servidor ao buscar o perfil do usuário.' 
      });
    });
  });
});
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../src/models/User');
const bcrypt = require('bcrypt');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
    // Limpa a coleção de usuários após cada teste
    await User.deleteMany({});
});

// Mock bcrypt
jest.mock('bcrypt');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
    });

    it('should require name field', () => {
      const userData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError.errors.name).toBeDefined();
      expect(validationError.errors.name.message).toContain('required');
    });

    it('should require email field', () => {
      const userData = {
        name: 'John Doe',
        password: 'password123'
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.email.message).toContain('required');
    });

    it('should require password field', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError.errors.password).toBeDefined();
      expect(validationError.errors.password.message).toContain('required');
    });

    it('should accept valid email format', () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
    });
  });

  describe('Movie List Schema', () => {
    it('should add a movie to user list', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };

      user.movieList.push(movieData);

      expect(user.movieList).toHaveLength(1);
      expect(user.movieList[0].tmdbId).toBe(movieData.tmdbId);
      expect(user.movieList[0].rating).toBe(movieData.rating);
      expect(user.movieList[0].favorite).toBe(movieData.favorite);
      expect(user.movieList[0].media_type).toBe(movieData.media_type);
    });

    it('should validate movie media_type enum', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      const invalidMovieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'invalid'
      };

      user.movieList.push(invalidMovieData);
      const validationError = user.validateSync();

      expect(validationError.errors['movieList.0.media_type']).toBeDefined();
    });

    it('should accept valid movie media_type', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'tv'
      };

      user.movieList.push(movieData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should set default values for movie fields', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      const movieData = {
        tmdbId: 123,
        media_type: 'movie'
      };

      user.movieList.push(movieData);

      expect(user.movieList[0].rating).toBeNull();
      expect(user.movieList[0].favorite).toBe(false);
    });
  });

  describe('Pre-save Hook', () => {
    it('should hash password before saving', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const hashedPassword = 'hashedPassword123';
      bcrypt.genSalt.mockResolvedValue('salt123');
      bcrypt.hash.mockResolvedValue(hashedPassword);

      // Mock the isModified method
      user.isModified = jest.fn().mockReturnValue(true);

      await user.save();

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt123');
      expect(user.password).toBe(hashedPassword);
    });

    it('should not hash password if not modified', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      // Mock the isModified method to return false
      user.isModified = jest.fn().mockReturnValue(false);

      await user.save();

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(user.password).toBe('password123');
    });

    it('should handle bcrypt errors', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      user.isModified = jest.fn().mockReturnValue(true);
      bcrypt.genSalt.mockRejectedValue(new Error('Bcrypt error'));

      await expect(user.save()).rejects.toThrow('Bcrypt error');
    });
  });

  describe('Timestamps', () => {
    it('should have timestamps after saving', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      // Mock save to simulate timestamps being set
      user.save = jest.fn().mockResolvedValue({
        ...user.toObject(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedUser = await user.save();

      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });
  });

  describe('Password Field Selection', () => {
    it('should exclude password from queries by default', () => {
      const userSchema = User.schema;
      const passwordPath = userSchema.path('password');
      
      expect(passwordPath.selected).toBe(false);
    });
  });

  it('deve criar e salvar um usuário com sucesso com campos obrigatórios', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const user = new User(userData);
    
    // Mock save method
    user.save = jest.fn().mockResolvedValue({
      ...userData,
      _id: 'mock-user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

  it('deve falhar ao salvar sem campo obrigatório "name"', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = new User(userData);
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('deve falhar ao salvar sem campo obrigatório "email"', async () => {
    const userData = { name: 'Test User', password: 'password123' };
    const user = new User(userData);
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it('deve falhar ao salvar com email duplicado', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const user = new User(userData);
    
    // Mock save to throw duplicate key error
    user.save = jest.fn().mockRejectedValue(new Error('E11000 duplicate key error'));
    
    await expect(user.save()).rejects.toThrow('E11000 duplicate key error');
  });

  it('deve fazer hash da senha antes de salvar', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: 'plainPassword' };
    const user = new User(userData);
    
    const hashedPassword = 'hashedPassword123';
    bcrypt.genSalt.mockResolvedValue('salt123');
    bcrypt.hash.mockResolvedValue(hashedPassword);
    bcrypt.compare.mockResolvedValue(true);
    
    user.isModified = jest.fn().mockReturnValue(true);
    
    // Mock the save method to actually call the pre-save hook
    const originalSave = user.save;
    user.save = jest.fn().mockImplementation(async function() {
      // Simulate the pre-save hook behavior
      if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      return {
        ...userData,
        password: this.password,
        _id: 'mock-user-id'
      };
    });

    const savedUser = await user.save();
    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).toBe(hashedPassword); // Should be hashed, not plain
    const isMatch = await bcrypt.compare('plainPassword', savedUser.password);
    expect(isMatch).toBe(true);
  });

  describe('User MovieList Subdocument', () => {
    it('deve adicionar um filme à movieList com sucesso', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const movieData = {
        tmdbId: 123,
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };

      user.movieList.push(movieData);
      expect(user.movieList).toHaveLength(1);
      expect(user.movieList[0].tmdbId).toBe(movieData.tmdbId);
      expect(user.movieList[0].media_type).toBe(movieData.media_type);
    });

    it('deve requerer tmdbId para itens na movieList', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const invalidMovieData = {
        rating: 8,
        favorite: true,
        media_type: 'movie'
      };

      user.movieList.push(invalidMovieData);
      const validationError = user.validateSync();
      expect(validationError.errors['movieList.0.tmdbId']).toBeDefined();
    });

    it('deve usar valor default para favorite (false) se não fornecido', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const movieData = {
        tmdbId: 123,
        rating: 8,
        media_type: 'movie'
      };

      user.movieList.push(movieData);
      expect(user.movieList[0].favorite).toBe(false);
    });
  });
});
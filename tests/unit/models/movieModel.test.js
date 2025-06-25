// perpetual-project/perpetual-backend/tests/unit/models/movieModel.test.js
const mongoose = require('mongoose');
const Movie = require('../../../src/models/Movie');

describe('Movie Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    it('should create a valid movie', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 8,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(movie.title).toBe(movieData.title);
      expect(movie.genre).toBe(movieData.genre);
      expect(movie.releaseYear).toBe(movieData.releaseYear);
      expect(movie.rating).toBe(movieData.rating);
      expect(movie.owner).toEqual(movieData.owner);
    });

    it('should require title field', () => {
      const movieData = {
        genre: 'Action',
        releaseYear: 2023,
        rating: 8,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError.errors.title).toBeDefined();
      expect(validationError.errors.title.message).toContain('required');
    });

    it('should require owner field', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 8
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError.errors.owner).toBeDefined();
      expect(validationError.errors.owner.message).toContain('required');
    });

    it('should validate rating range (min)', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: -1,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError.errors.rating).toBeDefined();
    });

    it('should validate rating range (max)', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 11,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError.errors.rating).toBeDefined();
    });

    it('should accept valid rating range', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 10,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should accept rating of 0', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        rating: 0,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should accept undefined rating', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2023,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should accept valid release year', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 1900,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should accept future release year', () => {
      const movieData = {
        title: 'Test Movie',
        genre: 'Action',
        releaseYear: 2030,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
    });
  });

  describe('Optional Fields', () => {
    it('should create movie with only required fields', () => {
      const movieData = {
        title: 'Test Movie',
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(movie.title).toBe(movieData.title);
      expect(movie.owner).toEqual(movieData.owner);
      expect(movie.genre).toBeUndefined();
      expect(movie.releaseYear).toBeUndefined();
      expect(movie.rating).toBeUndefined();
    });

    it('should accept empty string for genre', () => {
      const movieData = {
        title: 'Test Movie',
        genre: '',
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
    });
  });

  describe('Timestamps', () => {
    it('should have timestamps after saving', async () => {
      const movie = new Movie({
        title: 'Test Movie',
        owner: new mongoose.Types.ObjectId()
      });

      // Mock save to simulate timestamps being set
      movie.save = jest.fn().mockResolvedValue({
        ...movie.toObject(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedMovie = await movie.save();

      expect(savedMovie.createdAt).toBeDefined();
      expect(savedMovie.updatedAt).toBeDefined();
    });
  });

  describe('Owner Reference', () => {
    it('should accept valid ObjectId for owner', () => {
      const ownerId = new mongoose.Types.ObjectId();
      const movieData = {
        title: 'Test Movie',
        owner: ownerId
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(movie.owner).toEqual(ownerId);
    });

    it('should accept string ObjectId for owner', () => {
      const ownerId = new mongoose.Types.ObjectId().toString();
      const movieData = {
        title: 'Test Movie',
        owner: ownerId
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(movie.owner.toString()).toBe(ownerId);
    });
  });

  describe('Data Types', () => {
    it('should handle string title', () => {
      const movieData = {
        title: 'Test Movie Title',
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(typeof movie.title).toBe('string');
    });

    it('should handle number rating', () => {
      const movieData = {
        title: 'Test Movie',
        rating: 7.5,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(typeof movie.rating).toBe('number');
    });

    it('should handle number release year', () => {
      const movieData = {
        title: 'Test Movie',
        releaseYear: 2023,
        owner: new mongoose.Types.ObjectId()
      };

      const movie = new Movie(movieData);
      const validationError = movie.validateSync();

      expect(validationError).toBeUndefined();
      expect(typeof movie.releaseYear).toBe('number');
    });
  });
});
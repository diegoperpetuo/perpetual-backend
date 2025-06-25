// perpetual-project/perpetual-backend/tests/unit/services/movieService.test.js
const movieService = require('../../../src/services/movieService');
const Movie = require('../../../src/models/Movie');

// Mock the Movie model
jest.mock('../../../src/models/Movie');

describe('MovieService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a movie successfully', async () => {
            const movieData = {
                title: 'Test Movie',
                genre: 'Action',
                releaseYear: 2023,
                rating: 8
            };
            const ownerId = 'user-id';

            const mockMovie = {
                ...movieData,
                owner: ownerId,
                save: jest.fn().mockResolvedValue({ id: 'movie-id', ...movieData, owner: ownerId })
            };

            Movie.mockImplementation(() => mockMovie);

            const result = await movieService.create(movieData, ownerId);

            expect(Movie).toHaveBeenCalledWith({ ...movieData, owner: ownerId });
            expect(mockMovie.save).toHaveBeenCalled();
            expect(result).toEqual({ id: 'movie-id', ...movieData, owner: ownerId });
        });
    });

    describe('getAllByUser', () => {
        it('should get all movies for a user', async () => {
            const ownerId = 'user-id';
            const expectedMovies = [
                { id: '1', title: 'Movie 1', owner: ownerId },
                { id: '2', title: 'Movie 2', owner: ownerId }
            ];

            Movie.find.mockResolvedValue(expectedMovies);

            const result = await movieService.getAllByUser(ownerId);

            expect(Movie.find).toHaveBeenCalledWith({ owner: ownerId });
            expect(result).toEqual(expectedMovies);
        });
    });

    describe('getByIdAndUser', () => {
        it('should get a movie by id and user', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';
            const expectedMovie = { id: movieId, title: 'Test Movie', owner: ownerId };

            Movie.findOne.mockResolvedValue(expectedMovie);

            const result = await movieService.getByIdAndUser(movieId, ownerId);

            expect(Movie.findOne).toHaveBeenCalledWith({ _id: movieId, owner: ownerId });
            expect(result).toEqual(expectedMovie);
        });

        it('should return null when movie is not found', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';

            Movie.findOne.mockResolvedValue(null);

            const result = await movieService.getByIdAndUser(movieId, ownerId);

            expect(Movie.findOne).toHaveBeenCalledWith({ _id: movieId, owner: ownerId });
            expect(result).toBeNull();
        });
    });

    describe('updateByIdAndUser', () => {
        it('should update a movie successfully', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';
            const updateData = { title: 'Updated Movie', rating: 9 };
            const expectedMovie = { id: movieId, ...updateData, owner: ownerId };

            Movie.findOneAndUpdate.mockResolvedValue(expectedMovie);

            const result = await movieService.updateByIdAndUser(movieId, ownerId, updateData);

            expect(Movie.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: movieId, owner: ownerId },
                updateData,
                { new: true, runValidators: true }
            );
            expect(result).toEqual(expectedMovie);
        });

        it('should return null when movie is not found', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';
            const updateData = { title: 'Updated Movie' };

            Movie.findOneAndUpdate.mockResolvedValue(null);

            const result = await movieService.updateByIdAndUser(movieId, ownerId, updateData);

            expect(Movie.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: movieId, owner: ownerId },
                updateData,
                { new: true, runValidators: true }
            );
            expect(result).toBeNull();
        });
    });

    describe('partialUpdateByIdAndUser', () => {
        it('should partially update a movie successfully', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';
            const updateData = { rating: 9 };
            const expectedMovie = { id: movieId, title: 'Test Movie', rating: 9, owner: ownerId };

            Movie.findOneAndUpdate.mockResolvedValue(expectedMovie);

            const result = await movieService.partialUpdateByIdAndUser(movieId, ownerId, updateData);

            expect(Movie.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: movieId, owner: ownerId },
                { $set: updateData },
                { new: true, runValidators: true }
            );
            expect(result).toEqual(expectedMovie);
        });

        it('should return null when movie is not found', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';
            const updateData = { rating: 9 };

            Movie.findOneAndUpdate.mockResolvedValue(null);

            const result = await movieService.partialUpdateByIdAndUser(movieId, ownerId, updateData);

            expect(Movie.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: movieId, owner: ownerId },
                { $set: updateData },
                { new: true, runValidators: true }
            );
            expect(result).toBeNull();
        });
    });

    describe('deleteByIdAndUser', () => {
        it('should delete a movie successfully', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';
            const deletedMovie = { id: movieId, title: 'Test Movie', owner: ownerId };

            Movie.findOneAndDelete.mockResolvedValue(deletedMovie);

            const result = await movieService.deleteByIdAndUser(movieId, ownerId);

            expect(Movie.findOneAndDelete).toHaveBeenCalledWith({ _id: movieId, owner: ownerId });
            expect(result).toEqual(deletedMovie);
        });

        it('should return null when movie is not found', async () => {
            const movieId = 'movie-id';
            const ownerId = 'user-id';

            Movie.findOneAndDelete.mockResolvedValue(null);

            const result = await movieService.deleteByIdAndUser(movieId, ownerId);

            expect(Movie.findOneAndDelete).toHaveBeenCalledWith({ _id: movieId, owner: ownerId });
            expect(result).toBeNull();
        });
    });
});
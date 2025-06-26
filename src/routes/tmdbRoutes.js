const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdbController');

// Rotas para filmes
router.get('/movies/popular', tmdbController.getPopularMovies);
router.get('/movies/now-playing', tmdbController.getNowPlayingMovies);
router.get('/movies/trending', tmdbController.getTrendingMovies);
router.get('/movie/:id', tmdbController.getMovieDetails);

// Rotas para séries
router.get('/tv/popular', tmdbController.getPopularTVShows);
router.get('/tv/:id', tmdbController.getTVShowDetails);

// Rotas para gêneros
router.get('/genres', tmdbController.getAllGenres);

// Rotas para busca
router.get('/search/multi', tmdbController.searchMulti);
router.get('/search/movie', tmdbController.searchMovies);
router.get('/search/tv', tmdbController.searchTVShows);

// Rota genérica para detalhes de item
router.get('/:mediaType/:id', tmdbController.getItemDetails);

// Rota para buscar múltiplos itens
router.post('/multiple', tmdbController.getMultipleItems);

module.exports = router; 
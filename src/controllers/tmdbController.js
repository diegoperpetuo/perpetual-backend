const tmdbService = require('../services/tmdbService');

class TMDBController {
  // GET /api/tmdb/movies/popular
  async getPopularMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const movies = await tmdbService.getPopularMovies(parseInt(page));
      res.json(movies);
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar filmes populares'
      });
    }
  }

  // GET /api/tmdb/movies/now-playing
  async getNowPlayingMovies(req, res) {
    try {
      const { page = 1 } = req.query;
      const movies = await tmdbService.getNowPlayingMovies(parseInt(page));
      res.json(movies);
    } catch (error) {
      console.error('Erro ao buscar filmes em cartaz:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar filmes em cartaz'
      });
    }
  }

  // GET /api/tmdb/tv/popular
  async getPopularTVShows(req, res) {
    try {
      const { page = 1 } = req.query;
      const shows = await tmdbService.getPopularTVShows(parseInt(page));
      res.json(shows);
    } catch (error) {
      console.error('Erro ao buscar séries populares:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar séries populares'
      });
    }
  }

  // GET /api/tmdb/movies/trending
  async getTrendingMovies(req, res) {
    try {
      const { timeWindow = 'day' } = req.query;
      const movies = await tmdbService.getTrendingMovies(timeWindow);
      res.json(movies);
    } catch (error) {
      console.error('Erro ao buscar filmes em tendência:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar filmes em tendência'
      });
    }
  }

  // GET /api/tmdb/movie/:id
  async getMovieDetails(req, res) {
    try {
      const { id } = req.params;
      const { append_to_response } = req.query;
      
      const appendToResponse = append_to_response ? append_to_response.split(',') : [];
      const details = await tmdbService.getMovieDetails(id, appendToResponse);
      res.json(details);
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar detalhes do filme'
      });
    }
  }

  // GET /api/tmdb/tv/:id
  async getTVShowDetails(req, res) {
    try {
      const { id } = req.params;
      const { append_to_response } = req.query;
      
      const appendToResponse = append_to_response ? append_to_response.split(',') : [];
      const details = await tmdbService.getTVShowDetails(id, appendToResponse);
      res.json(details);
    } catch (error) {
      console.error('Erro ao buscar detalhes da série:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar detalhes da série'
      });
    }
  }

  // GET /api/tmdb/genres
  async getAllGenres(req, res) {
    try {
      const genres = await tmdbService.getAllGenres();
      res.json(genres);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar gêneros'
      });
    }
  }

  // GET /api/tmdb/search/multi
  async searchMulti(req, res) {
    try {
      const { query, page = 1 } = req.query;
      
      if (!query) {
        return res.status(400).json({
          error: 'Parâmetro "query" é obrigatório'
        });
      }

      const results = await tmdbService.searchMulti(query, parseInt(page));
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar itens'
      });
    }
  }

  // GET /api/tmdb/search/movie
  async searchMovies(req, res) {
    try {
      const { query, page = 1 } = req.query;
      
      if (!query) {
        return res.status(400).json({
          error: 'Parâmetro "query" é obrigatório'
        });
      }

      const results = await tmdbService.searchMovies(query, parseInt(page));
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar filmes'
      });
    }
  }

  // GET /api/tmdb/search/tv
  async searchTVShows(req, res) {
    try {
      const { query, page = 1 } = req.query;
      
      if (!query) {
        return res.status(400).json({
          error: 'Parâmetro "query" é obrigatório'
        });
      }

      const results = await tmdbService.searchTVShows(query, parseInt(page));
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar séries:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar séries'
      });
    }
  }

  // GET /api/tmdb/:mediaType/:id
  async getItemDetails(req, res) {
    try {
      const { mediaType, id } = req.params;
      const { append_to_response } = req.query;
      
      if (!['movie', 'tv'].includes(mediaType)) {
        return res.status(400).json({
          error: 'Tipo de mídia inválido. Use "movie" ou "tv"'
        });
      }

      const appendToResponse = append_to_response ? append_to_response.split(',') : [];
      const details = await tmdbService.getItemDetails(mediaType, id, appendToResponse);
      res.json(details);
    } catch (error) {
      console.error('Erro ao buscar detalhes do item:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar detalhes do item'
      });
    }
  }

  // POST /api/tmdb/multiple
  async getMultipleItems(req, res) {
    try {
      const { items } = req.body;
      
      if (!Array.isArray(items)) {
        return res.status(400).json({
          error: 'Parâmetro "items" deve ser um array'
        });
      }

      const results = await tmdbService.getMultipleItems(items);
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar múltiplos itens:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar múltiplos itens'
      });
    }
  }
}

module.exports = new TMDBController(); 
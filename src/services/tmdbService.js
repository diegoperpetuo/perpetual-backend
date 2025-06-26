const axios = require('axios');

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseURL = 'https://api.themoviedb.org/3';
    
    console.log('TMDBService constructor - API Key:', this.apiKey ? 'Present' : 'Missing');
    console.log('Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      TMDB_API_KEY: this.apiKey ? '***' + this.apiKey.slice(-4) : 'undefined'
    });
    
    if (!this.apiKey) {
      console.warn('TMDB_API_KEY não configurada no ambiente');
    }
  }

  // Helper para fazer requisições à API TMDB
  async makeRequest(endpoint, params = {}) {
    console.log('makeRequest called with endpoint:', endpoint);
    console.log('API Key available:', !!this.apiKey);
    
    if (!this.apiKey) {
      throw new Error('TMDB API key não configurada');
    }

    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          language: 'pt-BR',
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição TMDB:', error.message);
      throw new Error(`Erro ao buscar dados do TMDB: ${error.message}`);
    }
  }

  // Buscar filmes populares
  async getPopularMovies(page = 1) {
    return this.makeRequest('/movie/popular', { page });
  }

  // Buscar filmes em cartaz
  async getNowPlayingMovies(page = 1) {
    return this.makeRequest('/movie/now_playing', { page });
  }

  // Buscar séries populares
  async getPopularTVShows(page = 1) {
    return this.makeRequest('/tv/popular', { page });
  }

  // Buscar filmes em tendência
  async getTrendingMovies(timeWindow = 'day') {
    return this.makeRequest('/trending/movie/' + timeWindow);
  }

  // Buscar detalhes de um filme
  async getMovieDetails(movieId, appendToResponse = []) {
    const params = {};
    if (appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(',');
    }
    return this.makeRequest(`/movie/${movieId}`, params);
  }

  // Buscar detalhes de uma série
  async getTVShowDetails(tvId, appendToResponse = []) {
    const params = {};
    if (appendToResponse.length > 0) {
      params.append_to_response = appendToResponse.join(',');
    }
    return this.makeRequest(`/tv/${tvId}`, params);
  }

  // Buscar gêneros de filmes
  async getMovieGenres() {
    return this.makeRequest('/genre/movie/list');
  }

  // Buscar gêneros de séries
  async getTVGenres() {
    return this.makeRequest('/genre/tv/list');
  }

  // Buscar todos os gêneros (filmes + séries)
  async getAllGenres() {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        this.getMovieGenres(),
        this.getTVGenres()
      ]);

      const genresMap = {};
      
      if (movieGenres.genres) {
        movieGenres.genres.forEach(genre => {
          if (genre.id && genre.name) {
            genresMap[genre.id] = genre.name;
          }
        });
      }

      if (tvGenres.genres) {
        tvGenres.genres.forEach(genre => {
          if (genre.id && genre.name) {
            genresMap[genre.id] = genre.name;
          }
        });
      }

      return genresMap;
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      throw error;
    }
  }

  // Buscar múltiplos itens (filmes e séries)
  async searchMulti(query, page = 1) {
    return this.makeRequest('/search/multi', {
      query,
      page,
      include_adult: false
    });
  }

  // Buscar filmes
  async searchMovies(query, page = 1) {
    return this.makeRequest('/search/movie', {
      query,
      page,
      include_adult: false
    });
  }

  // Buscar séries
  async searchTVShows(query, page = 1) {
    return this.makeRequest('/search/tv', {
      query,
      page,
      include_adult: false
    });
  }

  // Buscar detalhes completos de um item (filme ou série)
  async getItemDetails(mediaType, itemId, appendToResponse = ['credits', 'videos']) {
    if (mediaType === 'movie') {
      return this.getMovieDetails(itemId, appendToResponse);
    } else if (mediaType === 'tv') {
      return this.getTVShowDetails(itemId, appendToResponse);
    } else {
      throw new Error('Tipo de mídia inválido. Use "movie" ou "tv"');
    }
  }

  // Buscar múltiplos itens por IDs
  async getMultipleItems(items) {
    const promises = items.map(item => {
      return this.getItemDetails(item.media_type, item.tmdbId)
        .then(details => ({
          ...details,
          media_type: item.media_type,
          userFavoriteData: item
        }))
        .catch(error => {
          console.warn(`Erro ao buscar detalhes para ${item.media_type} ID ${item.tmdbId}:`, error.message);
          return null;
        });
    });

    const results = await Promise.all(promises);
    return results.filter(item => item !== null);
  }
}

module.exports = new TMDBService(); 
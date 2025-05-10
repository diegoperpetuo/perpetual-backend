const Movie = require('../models/Movie');
const logger = console;

exports.createMovie = async (req, res) => {
  try {
    const { title, genre, releaseYear, rating } = req.body;
    if (!title) return res.status(400).json({ error: 'Título é obrigatório' });

    const movie = new Movie({
      title,
      genre,
      releaseYear,
      rating,
      owner: req.user.id
    });
    await movie.save();
    logger.log(`Filme criado: ${title}`);
    res.status(201).json(movie);
  } catch (err) {
    logger.error('Erro ao criar filme:', err);
    res.status(500).json({ error: 'Erro ao criar filme' });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ owner: req.user.id });
    res.json(movies);
  } catch (err) {
    logger.error('Erro ao buscar filmes:', err);
    res.status(500).json({ error: 'Erro ao buscar filmes' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, owner: req.user.id });
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(movie);
  } catch (err) {
    logger.error('Erro ao buscar filme por ID:', err);
    res.status(500).json({ error: 'Erro ao buscar filme' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMovie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(updatedMovie);
  } catch (err) {
    logger.error('Erro ao atualizar filme:', err);
    res.status(500).json({ error: 'Erro ao atualizar filme' });
  }
};

exports.partialUpdateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedMovie) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(updatedMovie);
  } catch (err) {
    logger.error('Erro ao atualizar parcialmente filme:', err);
    res.status(500).json({ error: 'Erro ao atualizar filme' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json({ message: 'Filme excluído com sucesso' });
  } catch (err) {
    logger.error('Erro ao excluir filme:', err);
    res.status(500).json({ error: 'Erro ao excluir filme' });
  }
};
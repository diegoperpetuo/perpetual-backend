const User = require('../models/User');

const addMovie = async (req, res) => {
  const { tmdbId, rating, favorite } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.sendStatus(404);

  if (user.movieList.some(movie => movie.tmdbId === tmdbId)) {
    return res.status(400).json({ error: 'Filme já adicionado' });
  }

  user.movieList.push({ tmdbId, rating, favorite });
  await user.save();
  res.json(user.movieList);
};

const removeMovie = async (req, res) => {
  const { tmdbId } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.sendStatus(404);

  user.movieList = user.movieList.filter(movie => movie.tmdbId !== parseInt(tmdbId));
  await user.save();
  res.json(user.movieList);
};

const getMovies = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.sendStatus(404);
  res.json(user.movieList);
};

module.exports = { addMovie, removeMovie, getMovies };

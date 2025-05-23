const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middlewares/authMiddleware');

// POST /api/user/movies
router.post('/user/movies', authenticateToken, async (req, res) => {
  const { tmdbId, rating, favorite } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.sendStatus(404);

  if (user.movieList.some(movie => movie.tmdbId === tmdbId)) {
    return res.status(400).json({ error: 'Filme já adicionado' });
  }

  user.movieList.push({ tmdbId, rating, favorite });
  await user.save();
  res.json(user.movieList);
});

module.exports = router;

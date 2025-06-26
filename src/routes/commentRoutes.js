const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authMiddleware');

// Rotas públicas (não precisam de autenticação)
router.get('/', commentController.getComments); // GET /api/comments?tmdbId=123&mediaType=movie
router.get('/user/:userId', commentController.getUserComments); // GET /api/comments/user/:userId

// Rotas protegidas (precisam de autenticação)
router.post('/', authenticate, commentController.createComment); // POST /api/comments
router.put('/:id', authenticate, commentController.updateComment); // PUT /api/comments/:id
router.delete('/:id', authenticate, commentController.deleteComment); // DELETE /api/comments/:id

module.exports = router; 
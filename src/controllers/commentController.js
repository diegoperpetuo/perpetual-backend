const commentService = require('../services/commentService');

class CommentController {
  // GET /api/comments - Buscar comentários por tmdbId e mediaType
  async getComments(req, res) {
    try {
      const { tmdbId, mediaType } = req.query;

      // Validação dos parâmetros
      if (!tmdbId || !mediaType) {
        return res.status(400).json({
          error: 'tmdbId e mediaType são obrigatórios'
        });
      }

      if (!['movie', 'tv'].includes(mediaType)) {
        return res.status(400).json({
          error: 'mediaType deve ser "movie" ou "tv"'
        });
      }

      const comments = await commentService.getCommentsByMedia(
        parseInt(tmdbId),
        mediaType
      );

      res.json(comments);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar comentários'
      });
    }
  }

  // POST /api/comments - Criar novo comentário
  async createComment(req, res) {
    try {
      const { tmdbId, mediaType, text } = req.body;
      const userId = req.user.id; // Vem do middleware de autenticação

      const commentData = {
        tmdbId,
        mediaType,
        text
      };

      const newComment = await commentService.createComment(commentData, userId);

      res.status(201).json(newComment);
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      
      if (error.message.includes('obrigatório') || error.message.includes('máximo')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Erro interno do servidor ao criar comentário'
      });
    }
  }

  // PUT /api/comments/:id - Atualizar comentário
  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const userId = req.user.id;

      const updateData = { text };

      const updatedComment = await commentService.updateComment(
        id,
        userId,
        updateData
      );

      res.json(updatedComment);
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      
      if (error.message.includes('não encontrado') || 
          error.message.includes('permissão') ||
          error.message.includes('obrigatório') ||
          error.message.includes('máximo')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Erro interno do servidor ao atualizar comentário'
      });
    }
  }

  // DELETE /api/comments/:id - Deletar comentário
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await commentService.deleteComment(id, userId);

      res.json(result);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      
      if (error.message.includes('não encontrado') || 
          error.message.includes('permissão')) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: 'Erro interno do servidor ao deletar comentário'
      });
    }
  }

  // GET /api/comments/user/:userId - Buscar comentários de um usuário
  async getUserComments(req, res) {
    try {
      const { userId } = req.params;

      const comments = await commentService.getCommentsByUser(userId);

      res.json(comments);
    } catch (error) {
      console.error('Erro ao buscar comentários do usuário:', error);
      res.status(500).json({
        error: 'Erro interno do servidor ao buscar comentários do usuário'
      });
    }
  }
}

module.exports = new CommentController(); 
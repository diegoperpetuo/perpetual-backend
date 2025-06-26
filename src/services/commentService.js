const Comment = require('../models/Comment');
const User = require('../models/User');

class CommentService {
  // Buscar comentários por tmdbId e mediaType
  async getCommentsByMedia(tmdbId, mediaType) {
    try {
      const comments = await Comment.find({ tmdbId, mediaType })
        .sort({ createdAt: -1 }) // Mais recentes primeiro
        .populate('userId', 'name email'); // Populate com dados do usuário
      
      return comments;
    } catch (error) {
      throw new Error('Erro ao buscar comentários: ' + error.message);
    }
  }

  // Criar novo comentário
  async createComment(commentData, userId) {
    try {
      // Buscar dados do usuário
      const user = await User.findById(userId).select('name');
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Validar dados do comentário
      if (!commentData.text || commentData.text.trim().length === 0) {
        throw new Error('Texto do comentário é obrigatório');
      }

      if (commentData.text.length > 500) {
        throw new Error('Comentário deve ter no máximo 500 caracteres');
      }

      if (!commentData.tmdbId || !commentData.mediaType) {
        throw new Error('tmdbId e mediaType são obrigatórios');
      }

      if (!['movie', 'tv'].includes(commentData.mediaType)) {
        throw new Error('mediaType deve ser "movie" ou "tv"');
      }

      // Criar o comentário
      const newComment = new Comment({
        userId,
        username: user.name,
        tmdbId: commentData.tmdbId,
        mediaType: commentData.mediaType,
        text: commentData.text.trim()
      });

      const savedComment = await newComment.save();
      
      // Retornar comentário populado
      return await Comment.findById(savedComment._id)
        .populate('userId', 'name email');
    } catch (error) {
      throw new Error('Erro ao criar comentário: ' + error.message);
    }
  }

  // Atualizar comentário
  async updateComment(commentId, userId, updateData) {
    try {
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error('Comentário não encontrado');
      }

      // Verificar se o usuário é o dono do comentário
      if (comment.userId.toString() !== userId) {
        throw new Error('Você não tem permissão para editar este comentário');
      }

      // Validar dados de atualização
      if (updateData.text) {
        if (updateData.text.trim().length === 0) {
          throw new Error('Texto do comentário não pode estar vazio');
        }
        if (updateData.text.length > 500) {
          throw new Error('Comentário deve ter no máximo 500 caracteres');
        }
        updateData.text = updateData.text.trim();
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        updateData,
        { new: true, runValidators: true }
      ).populate('userId', 'name email');

      return updatedComment;
    } catch (error) {
      throw new Error('Erro ao atualizar comentário: ' + error.message);
    }
  }

  // Deletar comentário
  async deleteComment(commentId, userId) {
    try {
      const comment = await Comment.findById(commentId);
      
      if (!comment) {
        throw new Error('Comentário não encontrado');
      }

      // Verificar se o usuário é o dono do comentário
      if (comment.userId.toString() !== userId) {
        throw new Error('Você não tem permissão para deletar este comentário');
      }

      await Comment.findByIdAndDelete(commentId);
      return { message: 'Comentário deletado com sucesso' };
    } catch (error) {
      throw new Error('Erro ao deletar comentário: ' + error.message);
    }
  }

  // Buscar comentários de um usuário específico
  async getCommentsByUser(userId) {
    try {
      const comments = await Comment.find({ userId })
        .sort({ createdAt: -1 })
        .populate('userId', 'name email');
      
      return comments;
    } catch (error) {
      throw new Error('Erro ao buscar comentários do usuário: ' + error.message);
    }
  }
}

module.exports = new CommentService(); 
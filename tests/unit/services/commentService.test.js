const mongoose = require('mongoose');
const commentService = require('../../../src/services/commentService');
const Comment = require('../../../src/models/Comment');
const User = require('../../../src/models/User');

// Mock do modelo User
jest.mock('../../../src/models/User');
jest.mock('../../../src/models/Comment');

describe('CommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommentsByMedia', () => {
    it('should return comments for a specific media', async () => {
      const mockComments = [
        {
          _id: 'comment1',
          userId: { _id: 'user1', name: 'John Doe' },
          username: 'John Doe',
          tmdbId: 550,
          mediaType: 'movie',
          text: 'Great movie!',
          createdAt: new Date()
        }
      ];

      Comment.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockComments)
        })
      });

      const result = await commentService.getCommentsByMedia(550, 'movie');

      expect(Comment.find).toHaveBeenCalledWith({ tmdbId: 550, mediaType: 'movie' });
      expect(result).toEqual(mockComments);
    });

    it('should throw error when database fails', async () => {
      Comment.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });

      await expect(commentService.getCommentsByMedia(550, 'movie'))
        .rejects.toThrow('Erro ao buscar comentários: Database error');
    });
  });

  describe('createComment', () => {
    it('should create a new comment successfully', async () => {
      const mockUser = { _id: 'user1', name: 'John Doe' };
      const mockComment = {
        _id: 'comment1',
        userId: 'user1',
        username: 'John Doe',
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Great movie!',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      Comment.mockImplementation(() => mockComment);
      Comment.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockComment)
      });

      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Great movie!'
      };

      const result = await commentService.createComment(commentData, 'user1');

      expect(User.findById).toHaveBeenCalledWith('user1');
      expect(Comment).toHaveBeenCalledWith({
        userId: 'user1',
        username: 'John Doe',
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Great movie!'
      });
      expect(result).toEqual(mockComment);
    });

    it('should throw error when user not found', async () => {
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Great movie!'
      };

      await expect(commentService.createComment(commentData, 'user1'))
        .rejects.toThrow('Erro ao criar comentário: Usuário não encontrado');
    });

    it('should throw error when text is empty', async () => {
      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: ''
      };

      await expect(commentService.createComment(commentData, 'user1'))
        .rejects.toThrow('Erro ao criar comentário: Texto do comentário é obrigatório');
    });

    it('should throw error when text is too long', async () => {
      const longText = 'a'.repeat(501);
      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: longText
      };

      await expect(commentService.createComment(commentData, 'user1'))
        .rejects.toThrow('Erro ao criar comentário: Comentário deve ter no máximo 500 caracteres');
    });
  });

  describe('updateComment', () => {
    it('should update comment successfully', async () => {
      const mockComment = {
        _id: 'comment1',
        userId: 'user1',
        username: 'John Doe',
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Updated text',
        toString: jest.fn().mockReturnValue('user1')
      };

      const updatedComment = { ...mockComment, text: 'Updated text' };

      Comment.findById = jest.fn().mockResolvedValue(mockComment);
      Comment.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedComment)
      });

      const result = await commentService.updateComment('comment1', 'user1', { text: 'Updated text' });

      expect(Comment.findById).toHaveBeenCalledWith('comment1');
      expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
        'comment1',
        { text: 'Updated text' },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedComment);
    });

    it('should throw error when comment not found', async () => {
      Comment.findById = jest.fn().mockResolvedValue(null);

      await expect(commentService.updateComment('comment1', 'user1', { text: 'Updated text' }))
        .rejects.toThrow('Erro ao atualizar comentário: Comentário não encontrado');
    });

    it('should throw error when user is not the owner', async () => {
      const mockComment = {
        _id: 'comment1',
        userId: 'user2',
        toString: jest.fn().mockReturnValue('user2')
      };

      Comment.findById = jest.fn().mockResolvedValue(mockComment);

      await expect(commentService.updateComment('comment1', 'user1', { text: 'Updated text' }))
        .rejects.toThrow('Erro ao atualizar comentário: Você não tem permissão para editar este comentário');
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      const mockComment = {
        _id: 'comment1',
        userId: 'user1',
        toString: jest.fn().mockReturnValue('user1')
      };

      Comment.findById = jest.fn().mockResolvedValue(mockComment);
      Comment.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      const result = await commentService.deleteComment('comment1', 'user1');

      expect(Comment.findById).toHaveBeenCalledWith('comment1');
      expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment1');
      expect(result).toEqual({ message: 'Comentário deletado com sucesso' });
    });

    it('should throw error when comment not found', async () => {
      Comment.findById = jest.fn().mockResolvedValue(null);

      await expect(commentService.deleteComment('comment1', 'user1'))
        .rejects.toThrow('Erro ao deletar comentário: Comentário não encontrado');
    });

    it('should throw error when user is not the owner', async () => {
      const mockComment = {
        _id: 'comment1',
        userId: 'user2',
        toString: jest.fn().mockReturnValue('user2')
      };

      Comment.findById = jest.fn().mockResolvedValue(mockComment);

      await expect(commentService.deleteComment('comment1', 'user1'))
        .rejects.toThrow('Erro ao deletar comentário: Você não tem permissão para deletar este comentário');
    });
  });
}); 
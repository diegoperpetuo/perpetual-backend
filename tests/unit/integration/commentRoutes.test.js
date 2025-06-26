const request = require('supertest');
const app = require('../../../src/index');
const mongoose = require('mongoose');
const User = require('../../../src/models/User');
const Comment = require('../../../src/models/Comment');
const jwt = require('jsonwebtoken');

describe('Comment Routes Integration Tests', () => {
  let testUser;
  let authToken;
  let testComment;

  beforeAll(async () => {
    // Criar usuário de teste
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // Gerar token de autenticação
    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    // Limpar dados de teste
    await User.deleteMany({});
    await Comment.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpar comentários antes de cada teste
    await Comment.deleteMany({});
  });

  describe('GET /api/comments', () => {
    it('should return comments for a specific media', async () => {
      // Criar comentário de teste
      const comment = new Comment({
        userId: testUser._id,
        username: testUser.name,
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Test comment'
      });
      await comment.save();

      const response = await request(app)
        .get('/api/comments')
        .query({ tmdbId: 550, mediaType: 'movie' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].text).toBe('Test comment');
    });

    it('should return 400 when tmdbId is missing', async () => {
      const response = await request(app)
        .get('/api/comments')
        .query({ mediaType: 'movie' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('tmdbId e mediaType são obrigatórios');
    });

    it('should return 400 when mediaType is invalid', async () => {
      const response = await request(app)
        .get('/api/comments')
        .query({ tmdbId: 550, mediaType: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('mediaType deve ser "movie" ou "tv"');
    });
  });

  describe('POST /api/comments', () => {
    it('should create a new comment successfully', async () => {
      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: 'New test comment'
      };

      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData);

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('New test comment');
      expect(response.body.tmdbId).toBe(550);
      expect(response.body.mediaType).toBe('movie');
      expect(response.body.username).toBe(testUser.name);
    });

    it('should return 401 when no token is provided', async () => {
      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: 'New test comment'
      };

      const response = await request(app)
        .post('/api/comments')
        .send(commentData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token não fornecido');
    });

    it('should return 400 when text is empty', async () => {
      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: ''
      };

      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('obrigatório');
    });

    it('should return 400 when text is too long', async () => {
      const longText = 'a'.repeat(501);
      const commentData = {
        tmdbId: 550,
        mediaType: 'movie',
        text: longText
      };

      const response = await request(app)
        .post('/api/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('máximo');
    });
  });

  describe('PUT /api/comments/:id', () => {
    beforeEach(async () => {
      // Criar comentário de teste
      testComment = new Comment({
        userId: testUser._id,
        username: testUser.name,
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Original comment'
      });
      await testComment.save();
    });

    it('should update comment successfully', async () => {
      const updateData = {
        text: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Updated comment');
    });

    it('should return 400 when comment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        text: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/comments/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('não encontrado');
    });

    it('should return 401 when no token is provided', async () => {
      const updateData = {
        text: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/comments/${testComment._id}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token não fornecido');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    beforeEach(async () => {
      // Criar comentário de teste
      testComment = new Comment({
        userId: testUser._id,
        username: testUser.name,
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Comment to delete'
      });
      await testComment.save();
    });

    it('should delete comment successfully', async () => {
      const response = await request(app)
        .delete(`/api/comments/${testComment._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Comentário deletado com sucesso');

      // Verificar se o comentário foi realmente deletado
      const deletedComment = await Comment.findById(testComment._id);
      expect(deletedComment).toBeNull();
    });

    it('should return 400 when comment not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/comments/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('não encontrado');
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .delete(`/api/comments/${testComment._id}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token não fornecido');
    });
  });

  describe('GET /api/comments/user/:userId', () => {
    it('should return user comments', async () => {
      // Criar comentários de teste
      const comment1 = new Comment({
        userId: testUser._id,
        username: testUser.name,
        tmdbId: 550,
        mediaType: 'movie',
        text: 'Comment 1'
      });
      const comment2 = new Comment({
        userId: testUser._id,
        username: testUser.name,
        tmdbId: 551,
        mediaType: 'movie',
        text: 'Comment 2'
      });
      await comment1.save();
      await comment2.save();

      const response = await request(app)
        .get(`/api/comments/user/${testUser._id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });
}); 
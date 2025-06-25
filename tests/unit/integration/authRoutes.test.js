const request = require('supertest');
const express = require('express');
const authRoutes = require('../../../src/routes/authRoutes');
const authService = require('../../../src/services/authService');
// Importa o app real para testar a rota protegida com o middleware real
const appInstance = require('../../../src/index'); // Assumindo que src/index.js exporta o app
const jwt = require('jsonwebtoken'); // Para mockar jwt.verify na rota protegida

jest.mock('../../../src/services/authService');

const app = express(); // App separado para rotas /register e /login que mockam o serviço
app.use(express.json());
app.use('/auth', authRoutes);


describe('Auth Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret'; // Necessário para o middleware real e para mock do jwt.verify
  });

  describe('POST /auth/register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      authService.register.mockResolvedValue({ message: 'Usuário registrado com sucesso' });

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Usuário registrado com sucesso' });
      expect(authService.register).toHaveBeenCalledWith(
        userData.name,
        userData.email,
        userData.password
      );
    });

    it('should handle registration error', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      authService.register.mockRejectedValue(new Error('Email inválido'));

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Email inválido' });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      authService.login.mockResolvedValue({ token: 'mock-jwt-token' });

      const res = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ token: 'mock-jwt-token' });
      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password
      );
    });

    it('should handle login error', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      authService.login.mockRejectedValue(new Error('Credenciais inválidas'));

      const res = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Credenciais inválidas' });
    });
  });

  describe('GET /auth/protected (com instância real do app e mock de jwt.verify)', () => {
    // Para esta rota, usamos a instância real do app de src/index.js
    // porque ela tem o middleware de autenticação real configurado.
    // Nós mockamos jwt.verify para controlar o resultado da autenticação.

    let originalVerify;
    beforeEach(() => {
        originalVerify = jwt.verify; // Salva a função original
    });
    afterEach(() => {
        jwt.verify = originalVerify; // Restaura a função original
    });

    it('deve permitir acesso com um token válido', async () => {
      jwt.verify = jest.fn().mockReturnValue({ id: 'userId123', /* outros dados do payload */ });

      const res = await request(appInstance) // Usa a instância real do app exportada de index.js
        .get('/auth/protected')
        .set('Authorization', 'Bearer validtoken');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Acesso autorizado' });
      expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
    });

    it('deve retornar 401 se nenhum token for fornecido', async () => {
      const res = await request(appInstance)
        .get('/auth/protected');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token não fornecido');
    });

    it('deve retornar 401 para um token inválido (jwt.verify lança erro)', async () => {
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      const res = await request(appInstance)
        .get('/auth/protected')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token inválido');
    });
  });
});
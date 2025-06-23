const authService = require('../../../src/services/authService');
const User = require('../../../src/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true)
      }));

      const result = await authService.register(name, email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(User).toHaveBeenCalledWith({ name, email, password });
      expect(result).toEqual({ message: 'Usuário registrado com sucesso' });
    });

    it('should throw error when name is missing', async () => {
      const name = '';
      const email = 'john@example.com';
      const password = 'password123';

      await expect(authService.register(name, email, password))
        .rejects
        .toThrow('Campos obrigatórios faltando: name');
    });

    it('should throw error when email is missing', async () => {
      const name = 'John Doe';
      const email = '';
      const password = 'password123';

      await expect(authService.register(name, email, password))
        .rejects
        .toThrow('Campos obrigatórios faltando: email');
    });

    it('should throw error when password is missing', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = '';

      await expect(authService.register(name, email, password))
        .rejects
        .toThrow('Campos obrigatórios faltando: password');
    });

    it('should throw error when email is invalid', async () => {
      const name = 'John Doe';
      const email = 'invalid-email';
      const password = 'password123';

      await expect(authService.register(name, email, password))
        .rejects
        .toThrow('Email inválido');
    });

    it('should throw error when password is too short', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = '123';

      await expect(authService.register(name, email, password))
        .rejects
        .toThrow('Senha inválida (mínimo de 6 caracteres)');
    });

    it('should throw error when email already exists', async () => {
      const name = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      User.findOne.mockResolvedValue({ email: 'john@example.com' });

      await expect(authService.register(name, email, password))
        .rejects
        .toThrow('E-mail já registrado');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const email = 'john@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      const mockUser = {
        _id: 'user-id',
        email: 'john@example.com',
        password: hashedPassword
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.login(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user-id' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });

    it('should throw error when email is missing', async () => {
      const email = '';
      const password = 'password123';

      await expect(authService.login(email, password))
        .rejects
        .toThrow('Email e senha são obrigatórios');
    });

    it('should throw error when password is missing', async () => {
      const email = 'john@example.com';
      const password = '';

      await expect(authService.login(email, password))
        .rejects
        .toThrow('Email e senha são obrigatórios');
    });

    it('should throw error when email is invalid', async () => {
      const email = 'invalid-email';
      const password = 'password123';

      await expect(authService.login(email, password))
        .rejects
        .toThrow('Email inválido');
    });

    it('should throw error when password is too short', async () => {
      const email = 'john@example.com';
      const password = '123';

      await expect(authService.login(email, password))
        .rejects
        .toThrow('Senha inválida (mínimo de 6 caracteres)');
    });

    it('should throw error when user is not found', async () => {
      const email = 'john@example.com';
      const password = 'password123';

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(authService.login(email, password))
        .rejects
        .toThrow('Credenciais inválidas');
    });

    it('should throw error when password is incorrect', async () => {
      const email = 'john@example.com';
      const password = 'wrongpassword';
      const hashedPassword = 'hashedPassword123';

      const mockUser = {
        _id: 'user-id',
        email: 'john@example.com',
        password: hashedPassword
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(email, password))
        .rejects
        .toThrow('Credenciais inválidas');
    });
  });
});
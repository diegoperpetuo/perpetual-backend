const authController = require('../../../src/controllers/authController');
const authService = require('../../../src/services/authService');

// Mock the authService
jest.mock('../../../src/services/authService');

describe('AuthController', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson
    };
    mockReq = {
      body: {}
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      mockReq.body = userData;
      
      const expectedResult = { message: 'Usuário registrado com sucesso' };
      authService.register.mockResolvedValue(expectedResult);

      await authController.register(mockReq, mockRes);

      expect(authService.register).toHaveBeenCalledWith(
        userData.name,
        userData.email,
        userData.password
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle registration error', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };
      mockReq.body = userData;
      
      const error = new Error('Email inválido');
      authService.register.mockRejectedValue(error);

      await authController.register(mockReq, mockRes);

      expect(authService.register).toHaveBeenCalledWith(
        userData.name,
        userData.email,
        userData.password
      );
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };
      mockReq.body = loginData;
      
      const expectedResult = { token: 'mock-jwt-token' };
      authService.login.mockResolvedValue(expectedResult);

      await authController.login(mockReq, mockRes);

      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle login error', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };
      mockReq.body = loginData;
      
      const error = new Error('Credenciais inválidas');
      authService.login.mockRejectedValue(error);

      await authController.login(mockReq, mockRes);

      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password
      );
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('protectedRoute', () => {
    it('should return authorized access message', () => {
      authController.protectedRoute(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Acesso autorizado' });
    });
  });
}); 
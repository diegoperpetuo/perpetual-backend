const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../src/middlewares/auth');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockNext = jest.fn();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockReq = {
      headers: {}
    };
    jest.clearAllMocks();
  });

  it('should call next() when valid token is provided', () => {
    const token = 'valid-token';
    const decodedToken = { id: 'user-id' };
    
    mockReq.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockReturnValue(decodedToken);

    authMiddleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(mockReq.user).toEqual(decodedToken);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 when no authorization header is provided', () => {
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header does not start with Bearer', () => {
    mockReq.headers.authorization = 'Invalid token';

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    const token = 'invalid-token';
    mockReq.headers.authorization = `Bearer ${token}`;
    
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when token is expired', () => {
    const token = 'expired-token';
    mockReq.headers.authorization = `Bearer ${token}`;
    
    jwt.verify.mockImplementation(() => {
      throw new Error('TokenExpiredError');
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle empty authorization header', () => {
    mockReq.headers.authorization = '';

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle authorization header with only Bearer', () => {
    mockReq.headers.authorization = 'Bearer ';

    // Mock jwt.verify to throw an error for empty token
    jwt.verify.mockImplementation(() => {
      throw new Error('jwt malformed');
    });

    authMiddleware(mockReq, mockRes, mockNext);

    // The middleware should still try to verify the empty token
    expect(jwt.verify).toHaveBeenCalledWith('', process.env.JWT_SECRET);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
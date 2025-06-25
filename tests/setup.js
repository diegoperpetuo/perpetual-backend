// perpetual-project/perpetual-backend/tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests unless explicitly needed
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock mongoose connection for unit tests
jest.mock('../src/database/connection', () => ({
  connect: jest.fn(),
  disconnect: jest.fn()
}));

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    _id: 'mock-user-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    movieList: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }),
  
  createMockMovie: (overrides = {}) => ({
    _id: 'mock-movie-id',
    title: 'Test Movie',
    genre: 'Action',
    releaseYear: 2023,
    rating: 8,
    owner: 'mock-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }),
  
  createMockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: { id: 'mock-user-id' },
    ...overrides
  }),
  
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  }
};

module.exports = async function () {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI_JEST_GLOBAL = mongoUri;
  global.__MONGO_INSTANCE__ = mongoServer;
  console.log(`MongoDB Memory Server (global) started at ${mongoUri}`);
};
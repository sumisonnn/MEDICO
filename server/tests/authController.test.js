import { jest } from '@jest/globals';
import { register, login } from '../controller/authController.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockUsers, createMockRequest, createMockResponse } from './mockData.js';

// Mock bcrypt and jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Mock the User model
jest.mock('../models/User.js', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

import { User } from '../models/User.js';

describe('Auth Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };

      mockReq.body = userData;
      User.findOne.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue('hashedpassword');
      
      const mockCreatedUser = {
        id: 1,
        username: userData.username,
        email: userData.email,
        role: userData.role
      };
      User.create.mockResolvedValue(mockCreatedUser);

      await register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        username: userData.username,
        email: userData.email,
        password: 'hashedpassword',
        role: 'user'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered',
        user: {
          id: mockCreatedUser.id,
          username: mockCreatedUser.username,
          email: mockCreatedUser.email,
          role: mockCreatedUser.role
        }
      });
    });

    it('should register admin user when role is admin', async () => {
      const userData = {
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      };

      mockReq.body = userData;
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      
      const mockCreatedUser = {
        id: 1,
        username: userData.username,
        email: userData.email,
        role: 'admin'
      };
      User.create.mockResolvedValue(mockCreatedUser);

      await register(mockReq, mockRes);

      expect(User.create).toHaveBeenCalledWith({
        username: userData.username,
        email: userData.email,
        password: 'hashedpassword',
        role: 'admin'
      });
    });

    it('should return 400 when required fields are missing', async () => {
      mockReq.body = { username: 'testuser' }; // Missing email and password

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return 400 when email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockReq.body = userData;
      User.findOne.mockResolvedValue({ id: 1 }); // Existing user

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });

    it('should handle database errors', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      mockReq.body = userData;
      User.findOne.mockResolvedValue(null);
      const error = new Error('Database error');
      User.create.mockRejectedValue(error);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Registration failed',
        error: error.message
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      };

      mockReq.body = loginData;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock.jwt.token');

      await login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      }, expect.any(String), { expiresIn: '1d' });
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'mock.jwt.token',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    });

    it('should return 400 when email or password is missing', async () => {
      mockReq.body = { email: 'test@example.com' }; // Missing password

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email and password required' });
    });

    it('should return 400 when user not found', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockReq.body = loginData;
      User.findOne.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 400 when password is incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'user'
      };

      mockReq.body = loginData;
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should handle database errors', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockReq.body = loginData;
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login failed',
        error: error.message
      });
    });
  });
}); 
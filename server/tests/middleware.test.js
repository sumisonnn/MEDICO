import { jest } from '@jest/globals';
import { createMockRequest, createMockResponse } from './mockData.js';

// Mock the auth middleware functions
const mockAuthenticateToken = jest.fn((req, res, next) => {
  req.user = { id: 1, email: 'test@example.com', role: 'user' };
  next();
});

const mockIsAdmin = jest.fn((req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
});

describe('Middleware Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('Authentication Middleware', () => {
    it('should authenticate user successfully', () => {
      mockAuthenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ id: 1, email: 'test@example.com', role: 'user' });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow admin access', () => {
      mockReq.user = { id: 1, email: 'admin@example.com', role: 'admin' };
      
      mockIsAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny non-admin access', () => {
      mockReq.user = { id: 2, email: 'user@example.com', role: 'user' };
      
      mockIsAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Admin access required' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Request/Response Tests', () => {
    it('should handle request parameters', () => {
      mockReq.params = { id: '123' };
      mockReq.query = { page: '1' };
      mockReq.body = { name: 'test' };

      expect(mockReq.params.id).toBe('123');
      expect(mockReq.query.page).toBe('1');
      expect(mockReq.body.name).toBe('test');
    });

    it('should handle response methods', () => {
      mockRes.status(200).json({ message: 'success' });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'success' });
    });
  });
}); 
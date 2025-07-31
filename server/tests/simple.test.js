import { jest } from '@jest/globals';
import { mockUsers, createMockRequest, createMockResponse } from './mockData.js';

describe('Simple Test with Mock Data', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle mock data', () => {
    expect(mockUsers).toHaveLength(2);
    expect(mockUsers[0].username).toBe('admin');
    expect(mockUsers[1].username).toBe('user1');
  });

  test('should handle mock request and response', () => {
    expect(mockReq.user.id).toBe(1);
    expect(typeof mockRes.status).toBe('function');
    expect(typeof mockRes.json).toBe('function');
  });

  test('should handle async operations', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
}); 
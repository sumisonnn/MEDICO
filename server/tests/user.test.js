import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

// Mock the middleware
jest.mock('../middleware/authMiddleware.js', () => ({
  authenticateToken: jest.fn((req, res, next) => next()),
  isAdmin: jest.fn((req, res, next) => next())
}));

// Mock the controller
jest.mock('../controller/userController.js', () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).json({ users: [] })),
  getUserById: jest.fn((req, res) => res.status(200).json({ user: { id: req.params.userId } })),
  updateUser: jest.fn((req, res) => res.status(200).json({ message: 'User updated' })),
  deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'User deleted' }))
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  describe('GET /api/users/all', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users/all')
        .expect(200);
      
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return user by ID', async () => {
      const userId = '123';
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', userId);
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should update user', async () => {
      const userId = '123';
      const updateData = { name: 'John Doe', email: 'john@example.com' };
      
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'User updated');
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete user', async () => {
      const userId = '123';
      
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'User deleted');
    });
  });
}); 
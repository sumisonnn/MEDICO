import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/user.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

// Mock the middleware
jest.mock('../middleware/authMiddleware.js', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: 1, email: 'test@example.com', role: 'user' };
    next();
  }),
  isAdmin: jest.fn((req, res, next) => next())
}));

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('Profile Routes', () => {
  describe('GET /api/users/profile', () => {
    it('should return current user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(200);
      
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username');
      expect(response.body.user).toHaveProperty('email');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update current user profile', async () => {
      const updateData = { 
        username: 'newusername', 
        email: 'newemail@example.com' 
      };
      
      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body).toHaveProperty('user');
    });
  });
}); 
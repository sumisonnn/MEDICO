import { jest } from '@jest/globals';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controller/userController.js';
import { User } from '../models/index.js';

// Mock the User model
jest.mock('../models/index.js', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn()
  }
}));

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date(),
  save: jest.fn(),
  destroy: jest.fn()
};

describe('User Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@example.com', role: 'user', createdAt: new Date() },
        { id: 2, username: 'user2', email: 'user2@example.com', role: 'admin', createdAt: new Date() }
      ];

      User.findAll.mockResolvedValue(mockUsers);

      await getAllUsers(mockReq, mockRes);

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'username', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith({ users: mockUsers });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      User.findAll.mockRejectedValue(error);

      await getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch users' });
    });
  });

  describe('getUserById', () => {
    it('should return user by ID successfully', async () => {
      mockReq.params.userId = '1';
      User.findByPk.mockResolvedValue(mockUser);

      await getUserById(mockReq, mockRes);

      expect(User.findByPk).toHaveBeenCalledWith('1', {
        attributes: ['id', 'username', 'email', 'role', 'createdAt']
      });
      expect(mockRes.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 404 when user not found', async () => {
      mockReq.params.userId = '999';
      User.findByPk.mockResolvedValue(null);

      await getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle database errors', async () => {
      mockReq.params.userId = '1';
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await getUserById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch user' });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      mockReq.params.userId = '1';
      mockReq.body = { username: 'updateduser', email: 'updated@example.com', role: 'admin' };
      
      User.findByPk.mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue(null); // No existing user with same email
      mockUser.save.mockResolvedValue();

      await updateUser(mockReq, mockRes);

      expect(mockUser.username).toBe('updateduser');
      expect(mockUser.email).toBe('updated@example.com');
      expect(mockUser.role).toBe('admin');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          createdAt: mockUser.createdAt
        }
      });
    });

    it('should return 404 when user not found', async () => {
      mockReq.params.userId = '999';
      User.findByPk.mockResolvedValue(null);

      await updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 400 when email already exists', async () => {
      mockReq.params.userId = '1';
      mockReq.body = { email: 'existing@example.com' };
      
      User.findByPk.mockResolvedValue(mockUser);
      User.findOne.mockResolvedValue({ id: 2 }); // Existing user with same email

      await updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should handle database errors', async () => {
      mockReq.params.userId = '1';
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update user' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockReq.params.userId = '2';
      mockReq.user.id = 1; // Different user (not self-deletion)
      
      User.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue();

      await deleteUser(mockReq, mockRes);

      expect(mockUser.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 when user not found', async () => {
      mockReq.params.userId = '999';
      User.findByPk.mockResolvedValue(null);

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 400 when trying to delete own account', async () => {
      mockReq.params.userId = '1';
      mockReq.user.id = 1; // Same user (self-deletion)
      
      User.findByPk.mockResolvedValue(mockUser);

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cannot delete your own account' });
    });

    it('should handle database errors', async () => {
      mockReq.params.userId = '1';
      const error = new Error('Database error');
      User.findByPk.mockRejectedValue(error);

      await deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete user' });
    });
  });
}); 
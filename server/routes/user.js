import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getCurrentUserProfile, updateCurrentUserProfile } from '../controller/userController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Current user routes (no admin required)
router.get('/profile', authenticateToken, getCurrentUserProfile);
router.put('/profile', authenticateToken, updateCurrentUserProfile);

// Admin routes (require admin access)
router.use(authenticateToken); // All remaining routes require authentication
router.use(isAdmin); // All remaining routes require admin access

router.get('/all', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router; 
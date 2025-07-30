import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controller/userController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken); // All user routes require authentication
router.use(isAdmin); // All user routes require admin access

router.get('/all', getAllUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router; 
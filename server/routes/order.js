import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders } from '../controller/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken); // All order routes require authentication

router.post('/create', createOrder);
router.get('/', getUserOrders);
router.get('/all', getAllOrders);
router.get('/:orderId', getOrderById);

export default router; 
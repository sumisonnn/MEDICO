import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder } from '../controller/orderController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authenticateToken); // All order routes require authentication

router.post('/create', createOrder);
router.get('/', getUserOrders);
router.get('/all', getAllOrders);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/status', isAdmin, updateOrderStatus);
router.delete('/:orderId', isAdmin, deleteOrder);

export default router; 
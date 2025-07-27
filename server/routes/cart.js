import express from 'express';
import { 
  getUserCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controller/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', getUserCart);

// Add item to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/update', updateCartItem);

// Remove item from cart
router.delete('/remove/:medicineId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

export default router; 
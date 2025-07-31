import { jest } from '@jest/globals';
import { 
  getUserCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controller/cartController.js';
import { mockCarts, mockCartItems, mockMedicines, createMockRequest, createMockResponse } from './mockData.js';

// Mock all models
jest.mock('../models/Cart.js', () => ({
  Cart: {
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../models/CartItem.js', () => ({
  CartItem: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

jest.mock('../models/Medicine.js', () => ({
  Medicine: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock('../models/User.js', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

// Import the mocked models
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Medicine } from '../models/Medicine.js';
import { User } from '../models/User.js';

describe('Cart Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('getUserCart', () => {
    it('should return user cart successfully', async () => {
      const mockCart = { id: 1, userId: 1, status: 'active' };
      const mockCartItems = [
        {
          id: 1,
          medicineId: 1,
          quantity: 2,
          price: 10.99,
          Medicine: {
            id: 1,
            name: 'Aspirin',
            category: 'Pain Relief',
            price: 10.99,
            stock: 100,
            image: '/uploads/aspirin.jpg'
          }
        }
      ];

      Cart.findOrCreate.mockResolvedValue([mockCart, false]);
      CartItem.findAll.mockResolvedValue(mockCartItems);

      await getUserCart(mockReq, mockRes);

      expect(Cart.findOrCreate).toHaveBeenCalledWith({
        where: { userId: 1, status: 'active' },
        defaults: { userId: 1, status: 'active' }
      });
      expect(CartItem.findAll).toHaveBeenCalledWith({
        where: { cartId: 1 },
        include: [{
          model: Medicine,
          attributes: ['id', 'name', 'category', 'price', 'stock', 'image']
        }],
        order: [['createdAt', 'ASC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        cartId: 1,
        items: [{
          id: 1,
          name: 'Aspirin',
          category: 'Pain Relief',
          price: 10.99,
          stock: 100,
          image: '/uploads/aspirin.jpg',
          quantity: 2,
          totalPrice: 21.98
        }],
        totalItems: 1,
        totalPrice: 21.98
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Cart.findOrCreate.mockRejectedValue(error);

      await getUserCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to get cart' });
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart successfully', async () => {
      const mockMedicine = {
        id: 1,
        name: 'Aspirin',
        stock: 100,
        price: 10.99
      };
      const mockCart = { id: 1, userId: 1, status: 'active' };

      mockReq.body = { medicineId: 1, quantity: 2 };

      Medicine.findByPk.mockResolvedValue(mockMedicine);
      Cart.findOrCreate.mockResolvedValue([mockCart, false]);
      CartItem.findOne.mockResolvedValue(null); // No existing item
      CartItem.create.mockResolvedValue({ id: 1 });

      await addToCart(mockReq, mockRes);

      expect(Medicine.findByPk).toHaveBeenCalledWith(1);
      expect(Cart.findOrCreate).toHaveBeenCalledWith({
        where: { userId: 1, status: 'active' },
        defaults: { userId: 1, status: 'active' }
      });
      expect(CartItem.findOne).toHaveBeenCalledWith({
        where: { cartId: 1, medicineId: 1 }
      });
      expect(CartItem.create).toHaveBeenCalledWith({
        cartId: 1,
        medicineId: 1,
        quantity: 2,
        price: 10.99
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Item added to cart successfully'
      });
    });

    it('should return 404 when medicine not found', async () => {
      mockReq.body = { medicineId: 999, quantity: 1 };

      Medicine.findByPk.mockResolvedValue(null);

      await addToCart(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Medicine not found' });
    });
  });
}); 
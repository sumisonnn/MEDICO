import { jest } from '@jest/globals';
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus 
} from '../controller/orderController.js';
import { mockOrders, mockOrderItems, mockCarts, mockCartItems, mockMedicines, createMockRequest, createMockResponse } from './mockData.js';

// Mock all models
jest.mock('../models/Order.js', () => ({
  Order: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock('../models/OrderItem.js', () => ({
  OrderItem: {
    create: jest.fn(),
    findAll: jest.fn()
  }
}));

jest.mock('../models/Cart.js', () => ({
  Cart: {
    findOne: jest.fn()
  }
}));

jest.mock('../models/CartItem.js', () => ({
  CartItem: {
    destroy: jest.fn()
  }
}));

jest.mock('../models/Medicine.js', () => ({
  Medicine: {
    update: jest.fn()
  }
}));

jest.mock('../models/User.js', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

// Import the mocked models
import { Order } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Medicine } from '../models/Medicine.js';
import { User } from '../models/User.js';

describe('Order Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('getUserOrders', () => {
    it('should return user orders successfully', async () => {
      const mockOrders = [
        {
          id: 1,
          userId: 1,
          totalAmount: 21.98,
          orderNumber: 'ORD-1234567890-123',
          status: 'confirmed',
          createdAt: new Date()
        }
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      await getUserOrders(mockReq, mockRes);

      expect(Order.findAll).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: [{
          model: OrderItem,
          include: [Medicine]
        }],
        order: [['createdAt', 'DESC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Order.findAll.mockRejectedValue(error);

      await getUserOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch user orders' });
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders successfully', async () => {
      const mockOrders = [
        {
          id: 1,
          userId: 1,
          totalAmount: 21.98,
          orderNumber: 'ORD-1234567890-123',
          status: 'confirmed',
          createdAt: new Date(),
          User: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        }
      ];

      Order.findAll.mockResolvedValue(mockOrders);

      await getAllOrders(mockReq, mockRes);

      expect(Order.findAll).toHaveBeenCalledWith({
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }, {
          model: OrderItem,
          include: [Medicine]
        }],
        order: [['createdAt', 'DESC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Order.findAll.mockRejectedValue(error);

      await getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch orders' });
    });
  });

  describe('getOrderById', () => {
    it('should return order by ID successfully', async () => {
      const mockOrder = {
        id: 1,
        userId: 1,
        totalAmount: 21.98,
        orderNumber: 'ORD-1234567890-123',
        status: 'confirmed',
        OrderItems: [
          {
            id: 1,
            medicineId: 1,
            quantity: 2,
            price: 10.99,
            Medicine: {
              id: 1,
              name: 'Aspirin',
              price: 10.99
            }
          }
        ]
      };

      mockReq.params.orderId = '1';

      Order.findOne.mockResolvedValue(mockOrder);

      await getOrderById(mockReq, mockRes);

      expect(Order.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        include: [{
          model: OrderItem,
          include: [Medicine]
        }]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 when order not found', async () => {
      mockReq.params.orderId = '999';

      Order.findOne.mockResolvedValue(null);

      await getOrderById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });
  });
}); 
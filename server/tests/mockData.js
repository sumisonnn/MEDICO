// Mock data for testing
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'hashedpassword',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    save: jest.fn(),
    destroy: jest.fn()
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: 'hashedpassword',
    role: 'user',
    createdAt: new Date('2024-01-02'),
    save: jest.fn(),
    destroy: jest.fn()
  }
];

export const mockMedicines = [
  {
    id: 1,
    name: 'Aspirin',
    category: 'Pain Relief',
    price: 10.99,
    stock: 100,
    image: '/uploads/aspirin.jpg',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Vitamin C',
    category: 'Vitamins',
    price: 15.99,
    stock: 50,
    image: '/uploads/vitaminc.jpg',
    createdAt: new Date('2024-01-02')
  }
];

export const mockCarts = [
  {
    id: 1,
    userId: 1,
    status: 'active',
    createdAt: new Date('2024-01-01')
  }
];

export const mockCartItems = [
  {
    id: 1,
    cartId: 1,
    medicineId: 1,
    quantity: 2,
    price: 10.99,
    Medicine: mockMedicines[0]
  }
];

export const mockOrders = [
  {
    id: 1,
    userId: 1,
    totalAmount: 21.98,
    orderNumber: 'ORD-1234567890-123',
    status: 'confirmed',
    deliveryAddress: '123 Main St',
    deliveryPhone: '1234567890',
    deliveryEmail: 'test@example.com',
    createdAt: new Date('2024-01-01')
  }
];

export const mockOrderItems = [
  {
    id: 1,
    orderId: 1,
    medicineId: 1,
    quantity: 2,
    price: 10.99,
    Medicine: mockMedicines[0]
  }
];

// Mock request and response objects
export const createMockRequest = (overrides = {}) => ({
  user: { id: 1 },
  body: {},
  params: {},
  query: {},
  file: null,
  ...overrides
});

export const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
});

// Mock model functions
export const mockModelFunctions = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  findOrCreate: jest.fn()
}; 
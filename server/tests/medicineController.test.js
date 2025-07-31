import { jest } from '@jest/globals';
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  getMedicinesByCategory,
  searchMedicines
} from '../controller/medicineController.js';
import { mockMedicines, createMockRequest, createMockResponse } from './mockData.js';

// Mock the Medicine model
jest.mock('../models/Medicine.js', () => ({
  Medicine: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

import { Medicine } from '../models/Medicine.js';

describe('Medicine Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('getAllMedicines', () => {
    it('should return all medicines successfully', async () => {
      const mockMedicines = [
        { id: 1, name: 'Aspirin', category: 'Pain Relief', price: 10.99, stock: 100 },
        { id: 2, name: 'Vitamin C', category: 'Vitamins', price: 15.99, stock: 50 }
      ];

      Medicine.findAll.mockResolvedValue(mockMedicines);

      await getAllMedicines(mockReq, mockRes);

      expect(Medicine.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockMedicines);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Medicine.findAll.mockRejectedValue(error);

      await getAllMedicines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to fetch medicines',
        error: error.message
      });
    });
  });

  describe('getMedicineById', () => {
    it('should return medicine by ID successfully', async () => {
      const mockMedicine = {
        id: 1,
        name: 'Aspirin',
        category: 'Pain Relief',
        price: 10.99,
        stock: 100
      };

      mockReq.params.id = '1';
      Medicine.findByPk.mockResolvedValue(mockMedicine);

      await getMedicineById(mockReq, mockRes);

      expect(Medicine.findByPk).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockMedicine);
    });

    it('should return 404 when medicine not found', async () => {
      mockReq.params.id = '999';
      Medicine.findByPk.mockResolvedValue(null);

      await getMedicineById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Medicine not found' });
    });

    it('should handle database errors', async () => {
      mockReq.params.id = '1';
      const error = new Error('Database error');
      Medicine.findByPk.mockRejectedValue(error);

      await getMedicineById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to fetch medicine',
        error: error.message
      });
    });
  });

  describe('createMedicine', () => {
    it('should create medicine successfully', async () => {
      const medicineData = {
        name: 'Aspirin',
        category: 'Pain Relief',
        price: '10.99',
        stock: '100'
      };

      const mockCreatedMedicine = {
        id: 1,
        ...medicineData,
        price: 10.99,
        stock: 100,
        image: null
      };

      mockReq.body = medicineData;
      Medicine.create.mockResolvedValue(mockCreatedMedicine);

      await createMedicine(mockReq, mockRes);

      expect(Medicine.create).toHaveBeenCalledWith({
        name: medicineData.name,
        category: medicineData.category,
        price: 10.99,
        stock: 100,
        image: null
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Medicine created successfully',
        medicine: mockCreatedMedicine
      });
    });

    it('should create medicine with image successfully', async () => {
      const medicineData = {
        name: 'Aspirin',
        category: 'Pain Relief',
        price: '10.99',
        stock: '100'
      };

      mockReq.body = medicineData;
      mockReq.file = { filename: 'aspirin.jpg' };

      const mockCreatedMedicine = {
        id: 1,
        ...medicineData,
        price: 10.99,
        stock: 100,
        image: '/uploads/aspirin.jpg'
      };

      Medicine.create.mockResolvedValue(mockCreatedMedicine);

      await createMedicine(mockReq, mockRes);

      expect(Medicine.create).toHaveBeenCalledWith({
        name: medicineData.name,
        category: medicineData.category,
        price: 10.99,
        stock: 100,
        image: '/uploads/aspirin.jpg'
      });
    });

    it('should return 400 when required fields are missing', async () => {
      mockReq.body = { name: 'Aspirin' }; // Missing other fields

      await createMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return 400 when fields are empty', async () => {
      mockReq.body = {
        name: '',
        category: 'Pain Relief',
        price: '10.99',
        stock: '100'
      };

      await createMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should handle database errors', async () => {
      const medicineData = {
        name: 'Aspirin',
        category: 'Pain Relief',
        price: '10.99',
        stock: '100'
      };

      mockReq.body = medicineData;
      const error = new Error('Database error');
      Medicine.create.mockRejectedValue(error);

      await createMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to create medicine',
        error: error.message
      });
    });
  });

  describe('updateMedicine', () => {
    it('should update medicine successfully', async () => {
      const updateData = {
        name: 'Updated Aspirin',
        category: 'Pain Relief',
        price: '15.99',
        stock: '150'
      };

      const mockMedicine = {
        id: 1,
        name: 'Aspirin',
        category: 'Pain Relief',
        price: 10.99,
        stock: 100,
        image: '/uploads/old.jpg',
        update: jest.fn()
      };

      mockReq.params.id = '1';
      mockReq.body = updateData;
      Medicine.findByPk.mockResolvedValue(mockMedicine);
      mockMedicine.update.mockResolvedValue();

      await updateMedicine(mockReq, mockRes);

      expect(mockMedicine.update).toHaveBeenCalledWith({
        name: updateData.name,
        category: updateData.category,
        price: 15.99,
        stock: 150,
        image: '/uploads/old.jpg'
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Medicine updated successfully',
        medicine: mockMedicine
      });
    });

    it('should update medicine with new image', async () => {
      const updateData = {
        name: 'Updated Aspirin',
        category: 'Pain Relief',
        price: '15.99',
        stock: '150'
      };

      const mockMedicine = {
        id: 1,
        name: 'Aspirin',
        category: 'Pain Relief',
        price: 10.99,
        stock: 100,
        image: '/uploads/old.jpg',
        update: jest.fn()
      };

      mockReq.params.id = '1';
      mockReq.body = updateData;
      mockReq.file = { filename: 'new-aspirin.jpg' };
      Medicine.findByPk.mockResolvedValue(mockMedicine);
      mockMedicine.update.mockResolvedValue();

      await updateMedicine(mockReq, mockRes);

      expect(mockMedicine.update).toHaveBeenCalledWith({
        name: updateData.name,
        category: updateData.category,
        price: 15.99,
        stock: 150,
        image: '/uploads/new-aspirin.jpg'
      });
    });

    it('should return 404 when medicine not found', async () => {
      mockReq.params.id = '999';
      Medicine.findByPk.mockResolvedValue(null);

      await updateMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Medicine not found' });
    });

    it('should handle database errors', async () => {
      mockReq.params.id = '1';
      const error = new Error('Database error');
      Medicine.findByPk.mockRejectedValue(error);

      await updateMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to update medicine',
        error: error.message
      });
    });
  });

  describe('deleteMedicine', () => {
    it('should delete medicine successfully', async () => {
      const mockMedicine = {
        id: 1,
        name: 'Aspirin',
        destroy: jest.fn()
      };

      mockReq.params.id = '1';
      Medicine.findByPk.mockResolvedValue(mockMedicine);
      mockMedicine.destroy.mockResolvedValue();

      await deleteMedicine(mockReq, mockRes);

      expect(mockMedicine.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Medicine deleted successfully'
      });
    });

    it('should return 404 when medicine not found', async () => {
      mockReq.params.id = '999';
      Medicine.findByPk.mockResolvedValue(null);

      await deleteMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Medicine not found' });
    });

    it('should handle database errors', async () => {
      mockReq.params.id = '1';
      const error = new Error('Database error');
      Medicine.findByPk.mockRejectedValue(error);

      await deleteMedicine(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to delete medicine',
        error: error.message
      });
    });
  });

  describe('getMedicinesByCategory', () => {
    it('should return medicines by category successfully', async () => {
      const mockMedicines = [
        { id: 1, name: 'Aspirin', category: 'Pain Relief', price: 10.99, stock: 100 },
        { id: 2, name: 'Ibuprofen', category: 'Pain Relief', price: 12.99, stock: 75 }
      ];

      mockReq.params.category = 'Pain Relief';
      Medicine.findAll.mockResolvedValue(mockMedicines);

      await getMedicinesByCategory(mockReq, mockRes);

      expect(Medicine.findAll).toHaveBeenCalledWith({
        where: { category: 'Pain Relief' },
        order: [['createdAt', 'DESC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockMedicines);
    });

    it('should handle database errors', async () => {
      mockReq.params.category = 'Pain Relief';
      const error = new Error('Database error');
      Medicine.findAll.mockRejectedValue(error);

      await getMedicinesByCategory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to fetch medicines by category',
        error: error.message
      });
    });
  });

  describe('searchMedicines', () => {
    it('should search medicines successfully', async () => {
      const mockMedicines = [
        { id: 1, name: 'Aspirin', category: 'Pain Relief', price: 10.99, stock: 100 }
      ];

      mockReq.query.q = 'aspirin';
      Medicine.findAll.mockResolvedValue(mockMedicines);

      await searchMedicines(mockReq, mockRes);

      expect(Medicine.findAll).toHaveBeenCalledWith({
        where: {
          [jest.any(Object)]: {
            [jest.any(Object)]: ['%aspirin%']
          }
        },
        order: [['createdAt', 'DESC']]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockMedicines);
    });

    it('should handle database errors', async () => {
      mockReq.query.q = 'aspirin';
      const error = new Error('Database error');
      Medicine.findAll.mockRejectedValue(error);

      await searchMedicines(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to search medicines',
        error: error.message
      });
    });
  });
}); 
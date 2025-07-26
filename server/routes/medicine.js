import express from 'express';
import { 
  getAllMedicines, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  getMedicinesByCategory,
  searchMedicines
} from '../controller/medicineController.js';
import { uploadImage, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get all medicines
router.get('/', getAllMedicines);

// Search medicines
router.get('/search', searchMedicines);

// Get medicines by category
router.get('/category/:category', getMedicinesByCategory);

// Get single medicine
router.get('/:id', getMedicineById);

// Create new medicine with image upload
router.post('/', uploadImage, handleUploadError, createMedicine);

// Update medicine with image upload
router.put('/:id', uploadImage, handleUploadError, updateMedicine);

// Delete medicine
router.delete('/:id', deleteMedicine);

export default router; 
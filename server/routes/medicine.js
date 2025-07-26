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

const router = express.Router();

// Get all medicines
router.get('/', getAllMedicines);

// Search medicines
router.get('/search', searchMedicines);

// Get medicines by category
router.get('/category/:category', getMedicinesByCategory);

// Get single medicine
router.get('/:id', getMedicineById);

// Create new medicine
router.post('/', createMedicine);

// Update medicine
router.put('/:id', updateMedicine);

// Delete medicine
router.delete('/:id', deleteMedicine);

export default router; 
import { Medicine } from '../models/Medicine.js';

// Get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(medicines);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ message: 'Failed to fetch medicines', error: err.message });
  }
};

// Get single medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (err) {
    console.error('Error fetching medicine:', err);
    res.status(500).json({ message: 'Failed to fetch medicine', error: err.message });
  }
};

// Create new medicine
export const createMedicine = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const medicine = await Medicine.create({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock)
    });

    res.status(201).json({ 
      message: 'Medicine created successfully', 
      medicine 
    });
  } catch (err) {
    console.error('Error creating medicine:', err);
    res.status(500).json({ message: 'Failed to create medicine', error: err.message });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const medicineId = req.params.id;

    const medicine = await Medicine.findByPk(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.update({
      name: name || medicine.name,
      category: category || medicine.category,
      price: price ? parseFloat(price) : medicine.price,
      stock: stock !== undefined ? parseInt(stock) : medicine.stock
    });

    res.json({ 
      message: 'Medicine updated successfully', 
      medicine 
    });
  } catch (err) {
    console.error('Error updating medicine:', err);
    res.status(500).json({ message: 'Failed to update medicine', error: err.message });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    
    const medicine = await Medicine.findByPk(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.destroy();
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    console.error('Error deleting medicine:', err);
    res.status(500).json({ message: 'Failed to delete medicine', error: err.message });
  }
};

// Get medicines by category
export const getMedicinesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const medicines = await Medicine.findAll({
      where: { category },
      order: [['createdAt', 'DESC']]
    });
    res.json(medicines);
  } catch (err) {
    console.error('Error fetching medicines by category:', err);
    res.status(500).json({ message: 'Failed to fetch medicines', error: err.message });
  }
};

// Search medicines
export const searchMedicines = async (req, res) => {
  try {
    const { q } = req.query;
    const { Op } = require('sequelize');
    
    const medicines = await Medicine.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { category: { [Op.iLike]: `%${q}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(medicines);
  } catch (err) {
    console.error('Error searching medicines:', err);
    res.status(500).json({ message: 'Failed to search medicines', error: err.message });
  }
}; 
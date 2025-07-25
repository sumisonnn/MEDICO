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

// Create new medicine with image
export const createMedicine = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    
    // Debug: Log the received data
    console.log('Received medicine data:', { name, category, price, stock });
    console.log('File data:', req.file);
    
    // Check if required fields are present and not empty
    if (!name || !category || !price || stock === undefined || 
        name.trim() === '' || category.trim() === '' || price.toString().trim() === '' || stock.toString().trim() === '') {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const medicine = await Medicine.create({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imageUrl
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

// Update medicine with image
export const updateMedicine = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const medicineId = req.params.id;

    const medicine = await Medicine.findByPk(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Handle image upload
    let imageUrl = medicine.image; // Keep existing image if no new one
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await medicine.update({
      name: name || medicine.name,
      category: category || medicine.category,
      price: price ? parseFloat(price) : medicine.price,
      stock: stock !== undefined ? parseInt(stock) : medicine.stock,
      image: imageUrl
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
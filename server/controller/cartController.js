import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Medicine } from '../models/Medicine.js';
import { User } from '../models/User.js';

// Get user's active cart with items
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting cart for user ID:', userId);
    
    // Find or create active cart for user
    let [cart, created] = await Cart.findOrCreate({
      where: { userId, status: 'active' },
      defaults: { userId, status: 'active' }
    });

    console.log('Cart found/created:', cart.id, 'Created:', created);

    // Get cart items with medicine details
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{
        model: Medicine,
        attributes: ['id', 'name', 'category', 'price', 'stock', 'image']
      }],
      order: [['createdAt', 'ASC']]
    });

    console.log('Cart items found:', cartItems.length);

    // Format response
    const formattedItems = cartItems.map(item => ({
      id: item.medicineId,
      name: item.Medicine.name,
      category: item.Medicine.category,
      price: item.Medicine.price,
      stock: item.Medicine.stock,
      image: item.Medicine.image,
      quantity: item.quantity,
      totalPrice: parseFloat(item.price) * item.quantity
    }));

    const response = {
      cartId: cart.id,
      items: formattedItems,
      totalItems: formattedItems.length,
      totalPrice: formattedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    };

    console.log('Sending cart response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error getting user cart:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { medicineId, quantity = 1 } = req.body;

    console.log('Adding to cart - User ID:', userId, 'Medicine ID:', medicineId, 'Quantity:', quantity);

    // Validate medicine exists
    const medicine = await Medicine.findByPk(medicineId);
    if (!medicine) {
      console.log('Medicine not found:', medicineId);
      return res.status(404).json({ error: 'Medicine not found' });
    }

    console.log('Medicine found:', medicine.name);

    // Check stock
    if (medicine.stock < quantity) {
      console.log('Insufficient stock. Available:', medicine.stock, 'Requested:', quantity);
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Find or create active cart
    let [cart, created] = await Cart.findOrCreate({
      where: { userId, status: 'active' },
      defaults: { userId, status: 'active' }
    });

    console.log('Cart found/created:', cart.id, 'Created:', created);

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, medicineId }
    });

    if (existingItem) {
      console.log('Updating existing cart item');
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (medicine.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      
      await existingItem.update({ 
        quantity: newQuantity,
        price: medicine.price
      });
      console.log('Updated quantity to:', newQuantity);
    } else {
      console.log('Creating new cart item');
      // Add new item
      await CartItem.create({
        cartId: cart.id,
        medicineId,
        quantity,
        price: medicine.price
      });
      console.log('Created new cart item');
    }

    console.log('Item added to cart successfully');
    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { medicineId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Find user's active cart
    const cart = await Cart.findOne({
      where: { userId, status: 'active' }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Check if item exists in cart
    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, medicineId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Check stock
    const medicine = await Medicine.findByPk(medicineId);
    if (medicine.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update quantity
    await cartItem.update({ quantity });

    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { medicineId } = req.params;

    // Find user's active cart
    const cart = await Cart.findOne({
      where: { userId, status: 'active' }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove item from cart
    const deleted = await CartItem.destroy({
      where: { cartId: cart.id, medicineId }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's active cart
    const cart = await Cart.findOne({
      where: { userId, status: 'active' }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove all items from cart
    await CartItem.destroy({
      where: { cartId: cart.id }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}; 
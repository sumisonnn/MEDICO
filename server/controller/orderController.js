import { Order, OrderItem, Cart, CartItem, Medicine, User } from '../models/index.js';
import { Op } from 'sequelize';

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Update any existing invalid status orders to confirmed
export const updateInvalidStatusOrders = async () => {
  try {
    const updatedCount = await Order.update(
      { status: 'confirmed' },
      { where: { 
        status: { 
          [Op.notIn]: ['confirmed', 'shipped', 'delivered', 'cancelled'] 
        } 
      }}
    );
    if (updatedCount[0] > 0) {
      console.log(`Updated ${updatedCount[0]} orders to confirmed status`);
    }
  } catch (error) {
    console.error('Error updating order statuses:', error);
  }
};

// Create new order from cart
export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, deliveryPhone, deliveryEmail } = req.body;
    const userId = req.user.id;

    // Get user's active cart
    const cart = await Cart.findOne({
      where: { userId, status: 'active' },
      include: [{
        model: CartItem,
        include: [Medicine]
      }]
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock availability
    for (const cartItem of cart.CartItems) {
      if (cartItem.quantity > cartItem.Medicine.stock) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${cartItem.Medicine.name}. Available: ${cartItem.Medicine.stock}, Requested: ${cartItem.quantity}` 
        });
      }
    }

    // Calculate total amount
    const totalAmount = cart.CartItems.reduce((total, item) => {
      return total + (parseFloat(item.Medicine.price) * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      deliveryAddress,
      deliveryPhone,
      deliveryEmail,
      orderNumber: generateOrderNumber()
    });

    // Create order items from cart items and update stock
    const orderItems = await Promise.all(
      cart.CartItems.map(async (cartItem) => {
        // Create order item
        const orderItem = await OrderItem.create({
          orderId: order.id,
          medicineId: cartItem.medicineId,
          quantity: cartItem.quantity,
          price: cartItem.Medicine.price
        });

        // Update medicine stock
        await Medicine.update(
          { stock: cartItem.Medicine.stock - cartItem.quantity },
          { where: { id: cartItem.medicineId } }
        );

        return orderItem;
      })
    );

    // Clear the cart
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Get order with items for response
    const orderWithItems = await Order.findOne({
      where: { id: order.id },
      include: [{
        model: OrderItem,
        include: [Medicine]
      }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: orderWithItems
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        include: [Medicine]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Medicine]
        },
        {
          model: User,
          attributes: ['id', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ orders });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{
        model: OrderItem,
        include: [Medicine]
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}; 

// Admin: Update order status (confirm/process)
export const updateOrderStatus = async (req, res) => {
  try {
    console.log('Update order status request:', { params: req.params, body: req.body, user: req.user });
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    console.log('Checking status:', { status, allowedStatuses, isValid: allowedStatuses.includes(status) });
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findByPk(orderId);
    console.log('Found order:', order ? { id: order.id, currentStatus: order.status } : 'Not found');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    console.log('Order status updated successfully');
    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
}; 
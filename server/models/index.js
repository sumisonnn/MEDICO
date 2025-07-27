import { User } from './User.js';
import { Medicine } from './Medicine.js';
import { Cart } from './Cart.js';
import { CartItem } from './CartItem.js';
import { Order } from './Order.js';
import { OrderItem } from './OrderItem.js';

// Define associations
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Medicine.hasMany(CartItem, { foreignKey: 'medicineId' });
CartItem.belongsTo(Medicine, { foreignKey: 'medicineId' });

// Order associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Medicine.hasMany(OrderItem, { foreignKey: 'medicineId' });
OrderItem.belongsTo(Medicine, { foreignKey: 'medicineId' });

export { User, Medicine, Cart, CartItem, Order, OrderItem }; 
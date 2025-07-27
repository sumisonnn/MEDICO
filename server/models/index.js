import { User } from './User.js';
import { Medicine } from './Medicine.js';
import { Cart } from './Cart.js';
import { CartItem } from './CartItem.js';

// Define associations
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Medicine.hasMany(CartItem, { foreignKey: 'medicineId' });
CartItem.belongsTo(Medicine, { foreignKey: 'medicineId' });

export { User, Medicine, Cart, CartItem }; 
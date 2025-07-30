import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
  status: { 
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'), 
    defaultValue: 'pending' 
  },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  deliveryAddress: { type: DataTypes.TEXT, allowNull: false },
  deliveryPhone: { type: DataTypes.STRING, allowNull: false },
  deliveryEmail: { type: DataTypes.STRING, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, defaultValue: 'Cash on Delivery' },
  orderNumber: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { timestamps: true }); 
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Orders', key: 'id' } },
  medicineId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Medicines', key: 'id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: true }); 
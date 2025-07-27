import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'abandoned'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
}); 
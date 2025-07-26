import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Medicine = sequelize.define('Medicine', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  category: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 0
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, { 
  timestamps: true 
}); 
import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    // Import models and establish associations
    import('./models/index.js');
    
    // Temporarily disable sync to avoid database errors
    await sequelize.sync({ alter: true });
    console.log('Database models loaded and synced');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}; 
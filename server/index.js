import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
import { connectDB } from './database.js';
import authRoutes from './routes/auth.js';
import medicineRoutes from './routes/medicine.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

import { updateInvalidStatusOrders } from './controller/orderController.js';

connectDB().then(async () => {
  // Update any existing invalid status orders to confirmed
  await updateInvalidStatusOrders();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 
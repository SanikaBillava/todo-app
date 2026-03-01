require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.VERCEL_URL
    ? (origin, cb) => cb(null, origin || true)
    : 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-app';
mongoose.connect(mongoUri).catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api/todos', todoRoutes);

module.exports = app;

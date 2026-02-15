const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

console.log("Starting Server Initialization...");

// 1. Environment Validation (Fail Fast)
const requiredEnv = ['MONGO_URI', 'PORT'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
    console.error(`FATAL: Missing Environment Variables: ${missingEnv.join(', ')}`);
    // On Render, logs might be buffered if we crash too fast.
    // We'll try to keep it alive for a sec to flush logs, but exit 1 is standard.
    console.error("Please add these variables in the Render Dashboard.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 10000;

// Connect to Database
console.log("Connecting to Database...");
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' })); // Allow all for now to fix frontend connectivity
app.use(express.json({ limit: '10kb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/scan', require('./routes/scanRoutes'));

// Health Check
app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.status(200).json({ status: 'UP', db: stateMap[dbState] });
});

app.get('/', (req, res) => {
    res.send('Scam Deduction API is Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

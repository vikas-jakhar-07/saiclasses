const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import the database utility
const database = require('./utils/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database when server starts
async function startServer() {
  try {
    // Connect to MongoDB
    await database.connect();
    
    // Import routes after database connection is established
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/courses', require('./routes/courses'));
    app.use('/api/health', require('./routes/health'));

    // Basic route
    app.get('/', (req, res) => {
      res.json({ 
        message: 'SALCLASS API is running...',
        database: 'Connected to MongoDB Atlas'
      });
    });

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      await database.disconnect();
      server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
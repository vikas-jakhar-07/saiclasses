const express = require('express');
const database = require('../utils/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = database.getDatabase();
    
    // Get database stats
    const stats = await db.stats();
    const collections = await db.listCollections().toArray();
    
    res.json({
      status: 'OK',
      database: {
        name: db.databaseName,
        collections: collections.length,
        size: stats.dataSize,
        connected: true
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: {
        connected: false,
        error: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
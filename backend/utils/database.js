const { MongoClient } = require('mongodb');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      return this.db;
    }

    try {
      console.log('🔗 Connecting to MongoDB Atlas...');
      
      // Create a new MongoClient
      this.client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      });

      // Connect to the MongoDB cluster
      await this.client.connect();
      
      // Connect to the specific database
      this.db = this.client.db('saiclass');
      this.isConnected = true;
      
      console.log('✅ Successfully connected to MongoDB Atlas!');
      console.log(`📊 Database: ${this.db.databaseName}`);
      
      // Verify connection by listing collections
      const collections = await this.db.listCollections().toArray();
      console.log(`📋 Collections: ${collections.length} found`);
      
      return this.db;
      
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      
      if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
        console.log('\n🔐 AUTHENTICATION ISSUE:');
        console.log('Please check:');
        console.log('1. Your password in the MONGODB_URI environment variable');
        console.log('2. That the database user exists in MongoDB Atlas');
        console.log('3. That your IP is whitelisted in Network Access');
      }
      
      throw error;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  getDatabase() {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getClient() {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.client;
  }
}

// Create a singleton instance
const database = new Database();

module.exports = database;
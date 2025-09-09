require('dotenv').config();
const database = require('../utils/database');

async function testConnection() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    
    // Connect to database
    const db = await database.connect();
    
    // Test some operations
    console.log('\n✅ Connection successful! Testing operations...');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`📋 Collections: ${collections.map(c => c.name).join(', ') || 'None'}`);
    
    // Create a test document if no collections exist
    if (collections.length === 0) {
      console.log('📝 Creating test collection...');
      const testCollection = db.collection('test_connection');
      await testCollection.insertOne({
        message: 'Test connection successful!',
        timestamp: new Date(),
        app: 'SailClass'
      });
      console.log('✅ Test document created');
    }
    
    // Get database stats
    const stats = await db.stats();
    console.log(`📊 Database stats: ${stats.dataSize} bytes, ${stats.collections} collections`);
    
    console.log('\n🎉 All tests passed! MongoDB connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await database.disconnect();
    process.exit(0);
  }
}

testConnection();
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/backtonostalgia';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB daemon at ${uri} was unreachable (${error.message}).`);
    console.log('🔄 Initializing in-memory MongoDB instance so Backto Nostalgia runs immediately without setup...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'backtonostalgia' }
      });
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Connected to In-Memory MongoDB: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error('❌ Fatal: Could not connect to MongoDB:', memErr.message);
      throw error;
    }
  }
};

const mongoose = require('mongoose');

const connectMainDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Main MongoDB connected');
  } catch (error) {
    console.error('❌ Main DB connection error:', error);
  }
};

const connectAdminDB = async () => {
  try {
    const adminConnection = await mongoose.createConnection(process.env.ADMIN_MONGO_URI);
     

    console.log('✅ Admin MongoDB connected');
    return adminConnection;
  } catch (error) {
    console.error('❌ Admin DB connection error:', error);
    throw error;
  }
};

const initializeDatabases = async () => {
  await connectMainDB();
  const adminConnection = await connectAdminDB();
  return { adminConnection };
};

module.exports = initializeDatabases().then((connections) => ({
  adminConnection: connections.adminConnection,
}));
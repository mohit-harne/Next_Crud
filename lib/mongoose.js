// lib/mongoose.js
import mongoose from 'mongoose';

let isConnected = false; // To track the connection status

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected.');
    return;
  }

  try {
    // Directly use the MongoDB URI here
    const mongoUri = 'mongodb+srv://mohitharne:Rohimonu%4012@sample-cluster.f7jvq.mongodb.net/testingdatabase';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectToDatabase;

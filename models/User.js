// models/User.js
import mongoose from 'mongoose';

// Define the schema for the user
const userSchema = new mongoose.Schema({
  id: String,          // This can be optional; MongoDB generates an _id by default
  first_name: String,  // First name of the user
  email: String,       // Email address
  phone: String,       // Phone number
  role: String,        // Role of the user (e.g., Admin, User)
}, {
  collection: 'testingcollections' // Explicitly specify the collection name
});

// Check if the model is already created, to prevent re-creating it multiple times during hot reloading
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

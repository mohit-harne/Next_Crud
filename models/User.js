import mongoose from 'mongoose';

// Define the schema for the user
const userSchema = new mongoose.Schema({
  id: { type: String, required: false }, // Optional field for a custom ID
  first_name: { type: String, required: true },  // First name of the user
  email: { type: String, required: true, unique: true },  // Email address (must be unique)
  phone: { type: String, required: true },  // Phone number
  role: { type: String, required: true },  // Role of the user (e.g., Admin, User)
  status: { type: String, required: true },
  image: { type: String, required: false } // URL of the user's profile image
}, {
  collection: 'testingcollections' // Explicitly specify the collection name
});

// Check if the model is already created to prevent re-creating it during hot reloading
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

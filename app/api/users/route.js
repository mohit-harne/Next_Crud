// app/api/users/route.js
import  connectToDatabase  from '../../../lib/mongoose';
import User from '../../../models/User';

export async function GET(req, res) {
  try {
    await connectToDatabase();
    const users = await User.find({});
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}

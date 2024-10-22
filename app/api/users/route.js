import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export async function GET(req) {
  try {
    await connectToDatabase();
    const users = await User.find({});
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id"); // This will now be the _id

    if (!userId) {
      return new Response('User ID (_id) is required', { status: 400 });
    }

    const user = await User.findByIdAndDelete(userId); // Using findByIdAndDelete with _id

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(`User with ID ${userId} deleted successfully`, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}


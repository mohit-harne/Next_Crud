// app/api/users/route.js
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export async function GET(req) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        // Fetch all users
        const users = await User.find();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}

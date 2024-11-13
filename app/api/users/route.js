import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export async function POST(req) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const userData = await req.json();

        // Validate the user data
        if (!userData.first_name || !userData.email || !userData.role) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store' // Prevent caching
                }
            });
        }

        // Create new user
        const newUser = new User(userData);
        await newUser.save();

        return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store' // Prevent caching
            }
        });
    } catch (error) {
        console.error("Error adding user:", error);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { 
            status: 500, 
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store' // Prevent caching
            } 
        });
    }
}

export async function GET(req) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        // Fetch all users
        const users = await User.find();
        
        // Return users with Cache-Control header set to prevent caching
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate' // Prevent caching
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(
            JSON.stringify({ error: `Internal Server Error: ${error.message}` }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
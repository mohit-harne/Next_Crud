import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const formData = await req.formData(); // Parse form data
        const first_name = formData.get('first_name');
        const email = formData.get('email');
        const role = formData.get('role');
        const status = formData.get('status');
        const phone = formData.get('phone');
        const imageFile = formData.get('image'); // Get image file

        // Validate required fields
        if (!first_name || !email || !role) {
            return NextResponse.json({ error: "Missing required fields: first_name, email, or role" }, {
                status: 400,
                headers: { 
                    'Cache-Control': 'no-store' // Prevent caching
                }
            });
        }

        // Convert image to base64 if provided
        let image = null;
        if (imageFile) {
            const buffer = await imageFile.arrayBuffer();
            image = Buffer.from(buffer).toString('base64'); // Convert to base64
        }

        // Create a new user
        const newUser = new User({
            first_name,
            email,
            role,
            status,
            phone,
            image, // Store the base64 image
        });
        await newUser.save();

        return NextResponse.json(newUser, {
            status: 201,
            headers: { 
                'Cache-Control': 'no-store' // Prevent caching
            }
        });
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { 
            status: 500, 
            headers: { 
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
        return NextResponse.json(users, {
            status: 200,
            headers: { 
                'Cache-Control': 'no-cache, no-store, must-revalidate' // Prevent caching
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}

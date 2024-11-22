import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongoose';
import User from '../../../models/User';

export async function POST(req) {
    try {
        const userData = await req.json();
        
        // Validate base64 image if present
        if (userData.image && !userData.image.startsWith('data:image')) {
            return NextResponse.json(
                { error: 'Invalid image format' },
                { status: 400 }
            );
        }

        await connectDB();
        
        // Create new user document with image
        const newUser = new User(userData);
        const savedUser = await newUser.save();

        return NextResponse.json({
            message: 'User created successfully',
            user: savedUser
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}).lean();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error in GET /api/users:', error);
        return NextResponse.json(
            { error: `Failed to fetch users: ${error.message}` },
            { status: 500 }
        );
    }
}


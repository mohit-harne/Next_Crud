import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID not provided" }), { 
                status: 400, 
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store' // Prevent caching
                } 
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { 
                status: 404, 
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store' // Prevent caching
                } 
            });
        }

        return new Response(JSON.stringify({ message: "User deleted successfully" }), { 
            status: 200, 
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store' // Prevent caching
            } 
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { 
            status: 500, 
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store' // Prevent caching
            } 
        });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params;
        const data = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID not provided" }), { 
                status: 400, 
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store' // Prevent caching
                } 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { 
                status: 404, 
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store' // Prevent caching
                } 
            });
        }

        return new Response(JSON.stringify(updatedUser), { 
            status: 200, 
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store' // Prevent caching
            } 
        });
    } catch (error) {
        console.error("Error updating user:", error);
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


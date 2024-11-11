// app/api/users/[id]/route.js
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params; // Get the dynamic ID from params

        if (!id) {
            return new Response("User ID not provided", { status: 400 });
        }

        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return new Response("User not found", { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User deleted successfully" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params; // Get the dynamic ID from params
        const data = await req.json(); // Get the update data from the request body

        console.log("Update Data:", data); // Debugging log to check the request body

        if (!id) {
            return new Response("User ID not provided", { status: 400 });
        }

        // Find and update the user by ID
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updatedUser) {
            return new Response("User not found", { status: 404 });
        }

        return new Response(JSON.stringify(updatedUser), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}

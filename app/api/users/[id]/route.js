// app/api/users/[id]/route.js
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID not provided" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params;
        const data = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID not provided" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(updatedUser), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

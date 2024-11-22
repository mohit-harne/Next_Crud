

// /api/users/[id]/route.js

import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

// DELETE: Delete a single user by ID or multiple users by IDs (bulk delete)
export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params;
        const { ids } = req.body; // For bulk delete, the list of IDs will come from the request body

        if (!id && !ids) {
            return new Response(JSON.stringify({ error: "No user ID(s) provided" }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
            });
        }

        if (id) {
            // Delete a single user by ID
            const deletedUser = await User.findByIdAndDelete(id);

            if (!deletedUser) {
                return new Response(JSON.stringify({ error: "User not found" }), { 
                    status: 404, 
                    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
                });
            }

            return new Response(JSON.stringify({ message: "User deleted successfully" }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
            });
        }

        if (ids && Array.isArray(ids) && ids.length > 0) {
            // Bulk delete: Delete multiple users by IDs
            const deletedUsers = await User.deleteMany({ _id: { $in: ids } });

            if (deletedUsers.deletedCount === 0) {
                return new Response(JSON.stringify({ error: "No users found to delete" }), { 
                    status: 404, 
                    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
                });
            }

            return new Response(JSON.stringify({ message: `${deletedUsers.deletedCount} users deleted successfully` }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
            });
        }

        return new Response(JSON.stringify({ error: "Invalid request data" }), { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });

    } catch (error) {
        console.error("Error deleting user(s):", error);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }
}

// PUT: Update a single user by ID
export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        console.log("Database connected successfully");

        const { id } = params;
        const data = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ error: "User ID not provided" }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: "User not found" }), { 
                status: 404, 
                headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
            });
        }

        return new Response(JSON.stringify(updatedUser), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }
}

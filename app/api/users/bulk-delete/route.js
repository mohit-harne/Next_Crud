// /api/users/bulk-delete/route.js
import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { ids } = await req.json(); // Retrieve the array of user IDs from the request body

        if (!Array.isArray(ids) || ids.length === 0) {
            return new Response(JSON.stringify({ error: 'No valid user IDs provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Perform bulk delete
        const result = await User.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'No users were deleted' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(
            JSON.stringify({ message: `${result.deletedCount} users were successfully deleted` }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error deleting users:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete users' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

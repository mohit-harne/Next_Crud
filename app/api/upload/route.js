import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Get the form data
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log('Received form fields:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Check for file in different possible field names
        const file = formData.get('file') || 
                    formData.get('image') || 
                    formData.get('profile_image') || 
                    formData.get('avatar');

        if (!file) {
            return NextResponse.json(
                { 
                    error: 'No file uploaded',
                    receivedFields: Array.from(formData.keys())
                },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString('base64');

        // Process file information
        const fileInfo = {
            fieldname: 'file',
            filename: file.name,
            size: file.size,
            mimetype: file.type,
            base64: `data:${file.type};base64,${base64String}`
        };

        // Return all form data along with file info
        const responseData = {
            message: 'File uploaded successfully',
            file: fileInfo,
            formData: Object.fromEntries(formData)
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('Error processing upload:', error);
        return NextResponse.json(
            {
                error: `Internal Server Error: ${error.message}`,
            },
            { status: 500 }
        );
    }
}

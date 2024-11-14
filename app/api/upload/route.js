import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import formidable from 'formidable';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Next.js 14 update for route config
export const runtime = 'edge';

export async function POST(req) {
  try {
    console.log("Attempting to connect to database...");
    await connectToDatabase();
    console.log("Database connected successfully");

    const form = new formidable.IncomingForm();
    console.log("Parsing form data...");

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Formidable parsing error:", err);
          return reject(new NextResponse(JSON.stringify({ error: "Error parsing form data" }), { status: 500 }));
        }

        const { first_name, email, role } = fields;
        const file = files.file?.[0];

        if (!first_name || !email || !role) {
          console.error("Missing required fields:", { first_name, email, role });
          return reject(new NextResponse(JSON.stringify({ error: "Missing required fields" }), { status: 400 }));
        }

        let imageUrl = "";
        if (file) {
          try {
            console.log("Uploading image to Cloudinary...");
            const uploadResponse = await cloudinary.v2.uploader.upload(file.filepath, {
              folder: 'user_images',
            });
            imageUrl = uploadResponse.secure_url;
            console.log("Image uploaded successfully:", imageUrl);
          } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return reject(new NextResponse(JSON.stringify({ error: "Error uploading image" }), { status: 500 }));
          }
        }

        console.log("Creating user in MongoDB...");
        const newUser = new User({
          first_name,
          email,
          role,
          imageUrl,
        });

        await newUser.save();
        console.log("User saved successfully in MongoDB");

        resolve(new NextResponse(JSON.stringify({ message: 'User added successfully', user: newUser }), { status: 201 }));
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), { status: 500 });
  }
}

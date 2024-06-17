import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Example function to upload an image
const uploadImage = async(imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

// Example usage
uploadImage('path/to/your/image.jpg');

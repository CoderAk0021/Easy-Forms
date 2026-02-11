import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


const Cloudinary = cloudinary.v2;



Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default Cloudinary;
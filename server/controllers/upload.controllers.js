import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs/promises';

export async function handleUploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const localFilePath = req.file.path;
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "form_uploads", 
      resource_type: "auto", 
    });
    await fs.unlink(localFilePath);

    res.json({
      url: result.secure_url,
      filename: result.original_filename,
      format: result.format,
    });
  } catch (error) {
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {}
    }

    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Upload failed" });
  }
}

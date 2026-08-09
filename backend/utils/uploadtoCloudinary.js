import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
   const uploadStream = cloudinary.uploader.upload_stream(
  {
    folder: "ai-learning-assistant/documents",
    resource_type: "image",
    public_id: `${Date.now()}-${originalName.replace(/\.pdf$/i, "")}`,
    format: "pdf",
  },
  (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  }
);

uploadStream.end(buffer);
    
  });
};
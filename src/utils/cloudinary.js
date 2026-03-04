import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded successfully
    //console.log("file uploaded on cloudinary successfully", response.url);
    fs.unlinkSync(localFilePath); //remove the file from local storage as we have the file on cloudinary
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the file from local storage as the operation failed
    return null;
  }
};

export { uploadOnCloudinary };

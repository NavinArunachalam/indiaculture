const cloudinary = require("../config/cloudinary");

// Upload a single file to Cloudinary
// Upload a single file to Cloudinary (supports videos)
const uploadSingleFile = (fileBuffer, folder = "uploads", type = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: type, // <-- important for videos
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};


// Upload multiple files to Cloudinary
const uploadMultipleFiles = async (files, folder = "uploads") => {
  const results = [];
  for (const file of files) {
    const uploaded = await uploadSingleFile(file.buffer, folder);
    results.push(uploaded);
  }
  return results;
};

// Format single file response
const formatSingleResponse = (cloudinaryResult) => ({
  url: cloudinaryResult.secure_url,
  public_id: cloudinaryResult.public_id,
});

// Format multiple files response
const formatMultipleResponse = (cloudinaryResults) =>
  cloudinaryResults.map((res) => ({
    url: res.secure_url,
    public_id: res.public_id,
  }));

// Delete a file from Cloudinary
const deleteFile = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Generate signature for direct upload
const getUploadSignature = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "reels" },
    process.env.CLOUDINARY_API_SECRET
  );
  return { signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME, folder: "reels" };
};


module.exports = {
  getUploadSignature,
  uploadSingleFile,
  uploadMultipleFiles,
  formatSingleResponse,
  formatMultipleResponse,
  deleteFile,
};

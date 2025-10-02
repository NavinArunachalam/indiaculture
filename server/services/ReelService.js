const Reel = require("../models/reel");
const { uploadSingleFile, formatSingleResponse, deleteFile } = require("./UploadService");

// ✅ Create a single reel (video only)
const createReel = async (data, file) => {
  if (!file) throw new Error("Video file is required");

  // Validate MIME type
  if (!file.mimetype.startsWith("video/")) {
    throw new Error("Only video files are allowed");
  }

  // Upload video to Cloudinary
  const uploadedFile = await uploadSingleFile(file.buffer, "reels", "video");

  // Format response for MongoDB
  const formattedFile = formatSingleResponse(uploadedFile);
  formattedFile.type = "video";

  // Save in MongoDB
  const reel = await Reel.create({
    product: data.product,       // required product ID
    media: [formattedFile],      // single video stored as array
    is_active: data.is_active ?? true,
  });

  return reel;
};

// ✅ Get all reels
const getAllReels = async () => {
  return await Reel.find().populate("product", "name");
};

// ✅ Delete a reel and its media
const deleteReel = async (id) => {
  const reel = await Reel.findById(id);
  if (!reel) throw new Error("Reel not found");

  // Delete video from Cloudinary
  for (const file of reel.media) {
    await deleteFile(file.public_id);
  }

  await reel.deleteOne();
  return { message: "Reel deleted successfully" };
};

module.exports = {
  createReel,
  getAllReels,
  deleteReel,
};

// controllers/uploadController.js
const { uploadFileResponse, uploadMultipleResponse, deleteFile } = require("../services/UploadService");

const singleUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = uploadFileResponse(req.file);
    res.json({ success: true, file: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const multiUpload = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }
    const results = uploadMultipleResponse(req.files);
    res.json({ success: true, files: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete image by public_id
const deleteUpload = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }

    const result = await deleteFile(public_id);
    if (result.result === "ok") {
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Image not found or already deleted" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { singleUpload, multiUpload, deleteUpload };

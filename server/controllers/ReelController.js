const Reel = require("../models/reel");
const { getUploadSignature, deleteFile } = require("../services/UploadService");

// GET /api/reels/signature
const getSignature = (req, res) => {
  try {
    const data = getUploadSignature();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/reels
const createReel = async (req, res) => {
  try {
    const { product, media } = req.body;

    if (!product) return res.status(400).json({ message: "Product is required" });
    if (!media?.url) return res.status(400).json({ message: "Video file URL is required" });

    const reel = await Reel.create({
      product,
      media,
      is_active: true,
    });

    res.status(201).json(reel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reels
const getReels = async (req, res) => {
  try {
    const reels = await Reel.find().populate("product", "name");
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reels/:id
const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    for (const file of reel.media) {
      await deleteFile(file.public_id);
    }

    await reel.deleteOne();
    res.json({ message: "Reel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSignature, createReel, getReels, deleteReel };

const Hero = require("../models/hero");
const {
  uploadMultipleFiles,
  formatMultipleResponse,
  deleteFile,
} = require("../services/UploadService");

// Fetch heroes
const fetchHero = async () => {
  try {
    return await Hero.find().populate("product").sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch heroes: " + error.message);
  }
};

// Add hero
const addHero = async (productId, files, existingImages = [], is_active = true) => {
  try {
    const uploaded = await uploadMultipleFiles(files, "hero");
    const uploadedImages = formatMultipleResponse(uploaded);

    const images = [...existingImages, ...uploadedImages].slice(0, 4);

    const hero = new Hero({
      product: productId,
      images,
      is_active,
    });

    return await hero.save();
  } catch (error) {
    throw new Error("Failed to add hero: " + error.message);
  }
};

// Update hero
const updateHero = async (id, productId, files, existingImages = [], is_active = true) => {
  try {
    const hero = await Hero.findById(id);
    if (!hero) throw new Error("Hero not found");

    const uploaded = await uploadMultipleFiles(files, "hero");
    const uploadedImages = formatMultipleResponse(uploaded);

    hero.images = [...existingImages, ...uploadedImages].slice(0, 4);
    hero.product = productId;
    hero.is_active = is_active;

    return await hero.save();
  } catch (error) {
    throw new Error("Failed to update hero: " + error.message);
  }
};

// Delete hero
const deleteHero = async (id) => {
  try {
    const hero = await Hero.findById(id);
    if (!hero) throw new Error("Hero not found");

    for (const img of hero.images) {
      if (img.public_id) await deleteFile(img.public_id);
    }

    return await Hero.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Failed to delete hero: " + error.message);
  }
};

module.exports = { fetchHero, addHero, updateHero, deleteHero };

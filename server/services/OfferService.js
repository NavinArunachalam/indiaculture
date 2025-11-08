const mongoose = require('mongoose');
const Offer = require('../models/offer');
const { uploadMultipleFiles, formatMultipleResponse, deleteFile } = require('../services/UploadService');

// Create a new offer
const createOffer = async (offerLine, products, file) => {
  try {
    let image = null;
    if (file) {
      const uploaded = await uploadMultipleFiles([file], 'offer');
      const uploadedImages = formatMultipleResponse(uploaded);
      image = uploadedImages[0]; // Take the first (and only) image
    }

    const offer = new Offer({
      offerLine,
      products,
      image,
    });

    return await offer.save();
  } catch (error) {
    throw new Error(`Failed to create offer: ${error.message}`);
  }
};

// Get all offers with populated products
const getAllOffers = async () => {
  try {
    return await Offer.find()
      .populate('products', 'name category new_price old_price stock images offer_line description badge')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Failed to fetch offers: ${error.message}`);
  }
};

// Update an offer
const updateOffer = async (id, offerLine, products, file, existingImage) => {
  try {
    const offer = await Offer.findById(id);
    if (!offer) throw new Error('Offer not found');

    let image = existingImage;
    if (file) {
      // Delete existing image if present
      if (offer.image?.public_id) {
        await deleteFile(offer.image.public_id);
      }
      const uploaded = await uploadMultipleFiles([file], 'offer');
      const uploadedImages = formatMultipleResponse(uploaded);
      image = uploadedImages[0]; // Take the first (and only) image
    }

    offer.offerLine = offerLine;
    offer.products = products;
    offer.image = image;

    return await offer.save();
  } catch (error) {
    throw new Error(`Failed to update offer: ${error.message}`);
  }
};

// Delete an offer
const deleteOffer = async (offerId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      throw new Error('Invalid offer ID');
    }
    const offer = await Offer.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.image?.public_id) {
      await deleteFile(offer.image.public_id);
    }

    return await Offer.findByIdAndDelete(offerId);
  } catch (error) {
    throw new Error(`Failed to delete offer: ${error.message}`);
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  updateOffer,
  deleteOffer,
};
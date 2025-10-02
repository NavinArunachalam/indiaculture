const offerService = require('../services/offerService');

const createOffer = async (req, res) => {
  try {
    const { offerLine, products } = req.body;
    const parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;
    if (!offerLine || !parsedProducts || !Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      return res.status(400).json({ message: 'Offer line and at least one product are required' });
    }
    const file = req.file; // Single file from multer
    const offer = await offerService.createOffer(offerLine, parsedProducts, file);
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllOffers = async (req, res) => {
  try {
    const offers = await offerService.getAllOffers();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { offerLine, products } = req.body;
    const parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;
    if (!offerLine || !parsedProducts || !Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      return res.status(400).json({ message: 'Offer line and at least one product are required' });
    }
    const file = req.file; // Single file from multer
    const existingImage = req.body.existingImage ? JSON.parse(req.body.existingImage) : null;
    const offer = await offerService.updateOffer(id, offerLine, parsedProducts, file, existingImage);
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await offerService.deleteOffer(id);
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  updateOffer,
  deleteOffer,
};
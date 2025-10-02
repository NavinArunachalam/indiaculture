const productService = require('../services/ProductService');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const mongoose = require("mongoose");

const createProduct = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    // Convert category string to ObjectId
    let categoryId;
    if (req.body.category && req.body.category !== "") {
categoryId = new mongoose.Types.ObjectId(req.body.category);

    } else {
      return res.status(400).json({ message: "Category is required" });
    }

    const productData = {
      ...req.body,
      category: categoryId,
    };

    const product = await productService.createProduct(productData, files);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};



// Update Product Controller
const updateProduct = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const { currentImages } = req.body;

    // Parse currentImages JSON if sent as strings
    let parsedCurrentImages = [];
    if (currentImages) {
      parsedCurrentImages = Array.isArray(currentImages)
        ? currentImages.map(img => typeof img === 'string' ? JSON.parse(img) : img)
        : [JSON.parse(currentImages)];
    }

    const productData = {
      ...req.body,
      currentImages: parsedCurrentImages,
    };

    const product = await productService.updateProduct(req.params.id, productData, files);
    res.json(product);
  } catch (error) {
    next(error);
  }
};




// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById, // add here
};

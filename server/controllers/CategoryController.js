const categoryService = require('../services/CategoryService');

// GET /api/categories
const fetchCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// ✅ GET /api/categories/:id
const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    next(error); // will send 404 or 500 depending on service
  }
};

// POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const file = req.file; // single image
    const category = await categoryService.createCategory(req.body, file);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const file = req.file; // optional new image
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
      file
    );
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchCategories,
  getCategoryById,   // 👈 added
  createCategory,
  updateCategory,
  deleteCategory,
};

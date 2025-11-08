const Category = require('../models/category');
const {
  uploadSingleFile,
  formatSingleResponse,
  deleteFile,
} = require('./UploadService'); // your existing Cloudinary service

// Fetch all categories
const getAllCategories = async () => {
  try {
    return await Category.find().sort({ name: 1 });
  } catch (error) {
    throw new Error('Failed to fetch categories: ' + error.message);
  }
};

// Create a new category with optional image
const createCategory = async (data, file = null) => {
  try {
    if (file) {
      const uploaded = await uploadSingleFile(file.buffer, 'categories');
      data.image = formatSingleResponse(uploaded); // { url, public_id }
    }

    const category = new Category(data);
    return await category.save();
  } catch (error) {
    throw new Error('Failed to create category: ' + error.message);
  }
};

// Update category with optional new image
const updateCategory = async (id, data, file = null) => {
  try {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    // If new file uploaded
    if (file) {
      // Delete old image if exists
      if (category.image?.public_id) {
        await deleteFile(category.image.public_id);
      }

      // Upload new image
      const uploaded = await uploadSingleFile(file.buffer, "categories");

      // Ensure consistent object format
      data.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    // Update category and return latest
    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updatedCategory;
  } catch (error) {
    throw new Error("Failed to update category: " + error.message);
  }
};
    // Delete category
const deleteCategory = async (id) => {
  try {
    const category = await Category.findById(id);
    if (category?.image?.public_id) {
      await deleteFile(category.image.public_id);
    }
    return await Category.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Failed to delete category: ' + error.message);
  }
};
// Get category by ID
const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");
    return category;
  } catch (error) {
    throw new Error("Failed to fetch category: " + error.message);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById, 
};


const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return res.status(400).json({
        success: false,
        message: 'Category name must be between 2 and 60 characters'
      });
    }

    const escapedName = trimmedName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = await Category.create({
      name: trimmedName,
      description: description && typeof description === 'string' ? description.trim() : ''
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name !== undefined) {
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }

      const trimmedName = name.trim();

      if (trimmedName.length < 2 || trimmedName.length > 60) {
        return res.status(400).json({
          success: false,
          message: 'Category name must be between 2 and 60 characters'
        });
      }

      const escapedName = trimmedName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const duplicateCategory = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') }
      });

      if (duplicateCategory) {
        return res.status(409).json({
          success: false,
          message: 'Category already exists'
        });
      }

      category.name = trimmedName;
    }

    if (description !== undefined) {
      category.description = typeof description === 'string' ? description.trim() : '';
    }

    await category.save();

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const linkedProductsCount = await Product.countDocuments({ category: id });

    if (linkedProductsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

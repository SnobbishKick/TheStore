const mongoose = require('mongoose');

// Type Schema
const typeSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// SubCategory Schema
const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    types: [typeSchema] // Array of types within each subcategory
});

// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subCategories: [subCategorySchema] // Array of subcategories within each category
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

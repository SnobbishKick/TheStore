const Product = require('../Schema/productSchema');
const Category = require('../Schema/Category');
const { validationResult } = require('express-validator');

// Add a single product
const addProduct = async (req, res) => {
    const { image, name, brand, price, category, subCategory, type, gender, description, inStock, attributes = {} } = req.body;

    try {
        // Validate category
        const categoryDoc = await Category.findOne({ _id: category });
        if (!categoryDoc) {
            return res.status(400).json({ message: 'Category does not exist' });
        }

        // Validate subcategory within the category
        const subCategoryDoc = categoryDoc.subCategories.find(sc => sc._id.toString() === subCategory);
        if (!subCategoryDoc) {
            return res.status(400).json({ message: 'Subcategory does not exist in the category' });
        }

        // Validate type within the subcategory
        const typeDoc = subCategoryDoc.types.find(t => t._id.toString() === type);
        if (!typeDoc) {
            return res.status(400).json({ message: 'Type does not exist in the subcategory' });
        }

        const product = new Product({
            image,
            name,
            brand,
            price,
            category,
            subCategory,
            type,
            gender,
            description,
            inStock,
            attributes,
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product', error });
    }
};



// Add multiple products
const addProducts = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const products = req.body.products; // Expecting an array of products

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and must not be empty' });
        }

        // Validate and prepare products
        const savePromises = products.map(async (product) => {
            const { image, name, brand, price, category, subCategory, type, gender, description, inStock, attributes } = product;

            // Find or create the category in the database
            let categoryData = await Category.findOne({ name: category });
            if (!categoryData) {
                // If category doesn't exist, create it
                categoryData = new Category({ name: category, subCategories: [] });
            }

            // Find or create the subcategory within the category
            let subCategoryData = categoryData.subCategories.find(subCat => subCat.name === subCategory);
            if (!subCategoryData) {
                // If subcategory doesn't exist, create it
                subCategoryData = { name: subCategory, types: [] };
                categoryData.subCategories.push(subCategoryData);
            }

            // Check if the type exists in the subcategory, if not, add it
            if (!subCategoryData.types.includes(type)) {
                subCategoryData.types.push(type);
            }

            // Save the updated category data
            await categoryData.save();

            // Validate gender based on category
            if (category === 'Electronics' && gender) {
                throw new Error('Gender should not be included for Electronics');
            }
            if ((category === 'Clothing' || category === 'Footwear') && !gender) {
                throw new Error('Gender is required for Clothing and Footwear');
            }

            // Ensure attributes are in the correct format
            const validatedAttributes = {};
            if (attributes) {
                Object.keys(attributes).forEach(key => {
                    validatedAttributes[key] = attributes[key].toString();
                });
            }

            // Create a new Product instance
            const newProduct = new Product({
                image,
                name,
                brand,
                price,
                category,
                subCategory,
                type,
                gender: category === 'Electronics' ? null : gender,
                description,
                inStock,
                attributes: validatedAttributes,
            });

            // Save product
            return newProduct.save(); // Return the promise
        });

        await Promise.all(savePromises);

        res.status(201).json({ message: "Products added successfully" });
    } catch (error) {
        console.log("controller error: ", error);
        res.status(500).json({ message: "Failed to add products", error: error.message });
    }
};


// Get all products
const getProduct = async (req, res) => {
    try {
        const productData = await Product.find();
        res.status(200).json({ productData });
    } catch (error) {
        console.log("controller error: ", error);
        res.status(500).json({ message: "Failed to get products", error: error.message });
    }
};

// Get paginated products with filtering and sorting
const getsomeProducts = async (req, res) => {
    try {
        // Parse and validate query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'name'; // Default sorting by name
        const order = req.query.order === 'desc' ? -1 : 1; // Default sorting order is ascending
        const filter = req.query.filter || {}; // Default to no filter

        // Ensure that page and limit are positive integers
        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Page and limit must be positive integers.' });
        }

        const startIndex = (page - 1) * limit;

        // Build the filter object based on query parameters
        const filterObject = {};
        if (filter.category) {
            filterObject.category = filter.category;
        }
        if (filter.price) {
            filterObject.price = { $lte: filter.price }; // Example filter for price
        }

        // Fetch paginated and filtered products with sorting
        const products = await Product.find(filterObject)
            .sort({ [sort]: order }) // Apply sorting
            .skip(startIndex)
            .limit(limit);

        // Count total number of products after filtering
        const totalProducts = await Product.countDocuments(filterObject);

        // Respond with paginated data
        res.json({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        });
    } catch (error) {
        // Log error and respond with appropriate message
        console.error('Error in getsomeProducts:', error.message); // Log only the error message
        res.status(500).json({ message: 'Server Error', error: error.message }); // Include error message in response
    }
};


// Get a single product by ID
const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
console.log(productId,"productId",product);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log("controller error: ", error);
        res.status(500).json({ message: "Failed to get product", error: error.message });
    }
};

// Get similar products by category
const getsimilarCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category }).limit(5);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get similar products', error: error.message });
    }
};

// Get products by category
const getCategoryWise = async (req, res) => {
    const categoryList = req.params.category;
    try {
        const categoryProducts = await Product.find({ category: categoryList });
        res.status(200).json(categoryProducts);
    } catch (error) {
        console.error("controller error: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, name, brand, price, category, subCategory, type, gender, description, inStock, attributes } = req.body;
        console.log("edit product", req.body);
        
        // Validate gender based on category
        if (category === 'Electronics' && gender) {
            return res.status(400).json({ message: 'Gender should not be included for Electronics' });
        }
        if ((category === 'Clothing' || category === 'Footwear') && !gender) {
            return res.status(400).json({ message: 'Gender is required for Clothing and Footwear' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { image, name, brand, price, category, subCategory, type, gender: category === 'Electronics' ? null : gender, description, inStock, attributes },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.log("controller error: ", error);
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("controller error: ", error);
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
};


const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().lean();
        const categoryData = categories.map(category => ({
            _id: category._id,
            name: category.name,
            subCategories: category.subCategories.map(sub => ({
                _id: sub._id,
                name: sub.name,
                types: sub.types
            }))
        }));
        res.json(categoryData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
    }
};

const getGenders = async (req, res) => {
    try {
        const genders = ['Men', 'Women', 'Unisex', 'Kids'];
        console.log("genders",genders);
        res.status(200).json(genders); // Return genders as an array
    } catch (error) {
        console.error('Error fetching genders:', error);
        res.status(500).json({ message: 'Error fetching genders' });
    }
};


const getAttributes = async (req, res) => {
    try {
        const attributes = {
            Electronics: ['Warranty', 'Brand', 'Model'],
            Clothing: ['Size', 'Material', 'Color'],
            Footwear: ['Size', 'Material', 'Color']
        };
        res.json(attributes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attributes: ' + error.message });
    }
};

module.exports = { addProduct, addProducts, getProduct, getsomeProducts, getProductById,getCategories,getAttributes,getGenders, getsimilarCategory, getCategoryWise, updateProduct, deleteProduct };

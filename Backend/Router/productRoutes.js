const express = require('express');
const { body, validationResult } = require('express-validator');
const productController = require('../Controller/productController');
const router = express.Router();

// Validation middleware
const validateProduct = [
    body('image').isString().withMessage('Image URL is required'),
    body('name').isString().withMessage('Product name is required'),
    body('brand').isString().withMessage('Brand is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').isString().withMessage('Category is required'),
    body('subCategory').isString().withMessage('Sub-Category is required'),
    body('type').isString().withMessage('Type is required'),
    body('description').isString().withMessage('Description is required'),
    body('inStock').isNumeric().withMessage('In Stock must be a number')
];

const validateProductsArray = [
    body('products')
        .isArray().withMessage('Products must be an array')
        .custom((products) => {
            if (products.length === 0) {
                throw new Error('Products array must not be empty');
            }
            return true;
        }),
    body('products.*').custom((product) => {
        // Create a validation chain for each product
        const errors = validationResult({ body: product });
        if (!errors.isEmpty()) {
            throw new Error('Product validation failed');
        }
        return true;
    })
];

// Define routes
router.post('/addproduct', validateProduct, productController.addProduct);
router.post('/addproducts', validateProductsArray, productController.addProducts);
router.get('/getsome', productController.getsomeProducts);
router.get('/getproduct', productController.getProduct);

router.get('/genders', productController.getGenders);

router.get('/:productId', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/categories', productController.getCategories);  // Fetch all categories

router.get('/similar/:category', productController.getsimilarCategory);
router.get('/category/:category', productController.getCategoryWise);

// New routes
router.get('/attributes', productController.getAttributes);  // Fetch all attributes

module.exports = router;

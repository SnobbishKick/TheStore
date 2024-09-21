// const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../Schema/adminSchema');
const Category = require('../Schema/Category');
const User = require("../Schema/userSchema");

const Product = require("../Schema/productSchema");
// const SubCategory = require('../Schema/subCategory');
// const Type = require('../Schema/Types');

const adminregister = async (req, res) => {
   const { email, password } = req.body;

   try {
       const hashedPassword = await bcrypt.hash(password, 10);

       const admin = new Admin({
           email,
           password: hashedPassword,
       });

       await admin.save();

       res.status(201).json({ message: 'Admin registered successfully' });
   } catch (error) {
       res.status(500).json({ message: 'Server error', error });
   }
}

const adminCredentials = {
    email: 'thestore862@gmail.com',
    password: '$2a$10$4LZf/bovizDr2QJqUud3c.sOY3v3n/pM9iRpimUqOQfqSKf9W4gaC', // Example hashed password
};

// Admin login function
const adminlogin = async (req, res) => {
    const { email, password } = req.body;
console.log("req.body",req.body);

    try {
        if (email !== adminCredentials.email) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, adminCredentials.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const adminToken = jwt.sign({ email: adminCredentials.email }, 'amal123', { expiresIn: '1h' });

        res.status(200).json({
            adminToken,
            admin: { email: adminCredentials.email },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const addCategory = async (req, res) => {
    try {
        const { name, subCategories  } = req.body;

        // Check if category name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category name already exists' });
        }

        // If category doesn't exist, create a new one
        const category = new Category({ name, subCategories });
        await category.save();
        
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add category', error: error.message });
    }
};

// Add SubCategory
const addSubCategory = async (req, res) => {
    const { categoryId, name, types = [] } = req.body;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.subCategories.push({ name, types });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add subcategory', error });
    }
};

// Add Type
const addTypes = async (req, res) => {
    const { categoryId, subCategoryId, name } = req.body;  // Make sure it expects categoryId and subCategoryId

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subCategory = category.subCategories.id(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        subCategory.types.push({ name });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add type', error });
    }
};


// Fetch Categories with SubCategories and Types
// const getCategories = async (req, res) => {
//     try {
//         console.log('Fetching categories...');
//         const categories = await Category.find();

//         // Initialize subCategories and types objects
//         const subCategories = [{}];
//         const types = [{}];

//         // Loop through each category
//         categories.forEach(category => {
//             // Populate subCategories object
//             subCategories[category._id] = category.subCategories.map(subCategory => ({
//                 _id: subCategory._id,
//                 name: subCategory.name,
//                 types: subCategory.types.map(type => ({
//                     _id: type._id,
//                     name: type.name
//                 }))
//             }));

//             // Populate types object
//             subCategories[category._id].forEach(subCategory => {
//                 if (!types[subCategory._id]) {
//                     types[subCategory._id] = [];
//                 }
//                 subCategory.types.forEach(type => {
//                     types[subCategory._id].push({
//                         _id: type._id,
//                         name: type.name
//                     });
//                 });
//             });
//         });

//         console.log('Categories fetched:', categories);
//         // console.log('SubCategories:', subCategories);
//         // console.log('Types:', types);

//         res.json({ categories
//             // , subCategories, types 
//             });
//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
//     }
// };

const getCategories = async (req, res) => {
    try {
        console.log('Fetching categories...');
        const categories = await Category.find();

        // Prepare the subCategories and types objects
        const subCategories = {};
        const types = {};

        // Loop through each category and populate subCategories and types
        categories.forEach(category => {
            subCategories[category._id] = category.subCategories.map(subCategory => ({
                _id: subCategory._id,
                name: subCategory.name,
                types: subCategory.types.map(type => ({
                    _id: type._id,
                    name: type.name
                }))
            }));

            // Populate types object
            subCategories[category._id].forEach(subCategory => {
                if (!types[subCategory._id]) {
                    types[subCategory._id] = [];
                }
                subCategory.types.forEach(type => {
                    types[subCategory._id].push({
                        _id: type._id,
                        name: type.name
                    });
                });
            });
        });

        // Return categories, subCategories, and types in the response
        res.json({ categories, subCategories, types });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
    }
};


// const addCategory=async (req, res) => {
//     const { name, subCategory } = req.body;
  
//     try {
//       // Check if the category already exists
//       let category = await Category.findOne({ name });
  
//       if (category) {
//         // If category exists, add sub-category
//         if (subCategory && !category.subCategories.some(sub => sub.name === subCategory)) {
//           category.subCategories.push({ name: subCategory });
//         }
//       } else {
//         // If category doesn't exist, create a new category
//         category = new Category({
//           name,
//           subCategories: subCategory ? [{ name: subCategory }] : [],
//         });
//       }
  
//       const savedCategory = await category.save();
//       res.json(savedCategory);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

// const getCategories=async (req, res) => {
//     try {
//       const categories = await Category.find();
//       res.json(categories);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };

const getPendingOrder = async (req, res) => {
    const { userId } = req.params; // Extract the userId from request parameters

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Filter user's orders to get pending orders
        const pendingOrders = user.orders.filter(order => order.status === 'pending');

        // Return the pending orders for the user
        res.status(200).json(pendingOrders);
    } catch (error) {
        console.error('Error fetching pending orders for the user:', error);
        res.status(500).json({ message: 'Failed to fetch pending orders.' });
    }
};


const approveOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.params;

        // Convert IDs to ObjectId if they are in string format
        const userObjectId = mongoose.Types.ObjectId(userId);
        const orderObjectId = new ObjectId(req.params.orderId);  // Correct usage

        // Find the user
        const user = await User.findById(userObjectId);
        if (!user) {
            console.error(`User not found with ID ${userId}`);
            return res.status(404).send('User not found');
        }

        // Find the order by its ID
        const order = user.orders.id(orderObjectId);
        if (!order) {
            console.error(`Order not found with ID ${orderId} for user ${userId}`);
            return res.status(404).send('Order not found');
        }

        // Check if the order is already approved
        if (order.status !== 'pending') {
            console.error(`Order ${orderId} has already been processed`);
            return res.status(400).send('Order already processed');
        }

        // Approve the order and reduce product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product_id);

            if (!product) {
                console.error(`Product not found with ID ${item.product_id}`);
                return res.status(404).json({ message: `Product not found for ID ${item.product_id}` });
            }

            // Ensure there's enough stock
            if (product.inStock < item.quantity) {
                console.error(`Not enough stock for product ${item.product_id}`);
                return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
            }

            product.inStock -= item.quantity;
            await product.save();
        }

        // Update order status to approved
        order.status = 'approved';
        await user.save();

        res.status(200).json({ message: 'Order approved' });
    } catch (error) {
        console.error('Error approving order:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).send('Server error');
    }
};


module.exports = {adminregister,adminlogin,addCategory,approveOrder,getPendingOrder,
    addSubCategory,addTypes,
    getCategories};

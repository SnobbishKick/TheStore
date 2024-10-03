

// const mongoose = require('mongoose');
// const Category = require('../Schema/Category'); // Assuming the path to your Category model

// const productSchema = new mongoose.Schema({
//     image: { type: String, required: true },
//     name: { type: String, required: true },
//     brand: { type: String, required: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
//     type: { type: String, required: true },
//     gender: {
//         type: String,
//         enum: ['Men', 'Women', 'Unisex', 'Kid'],
//         // required: function () {
//         //     return this.category === 'Clothing' || this.category === 'Footwear';
//         // },
//         // default:null
//     },
//     attributes: {
//         type: Map,
//         of: String, // Adjust the type according to your needs
//         default: {} // Default empty object },
//     },
//     description: { type: String, required: true },
//     inStock: { type: Number, required: true, default: 0, min: 0 }
// }, { timestamps: true });

// // Method to fetch valid categories from the database
// productSchema.statics.getValidCategories = async function () {
//     const categories = await Category.find();
//     return categories.map(cat => cat.name);
// };

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;


const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Category = require('../Schema/Category');

const EMAIL_USER = "amalajijkl@gmail.com";
const EMAIL_PASS = "lvjr ccnh thqh gcwu";
const jwtSecretKey = "amal123";

const productSchema = new mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    type: { type: String, required: true },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex', 'Kid', 'none'], 
        default: 'none', 
    },
    attributes: {
        type: Map,
        of: String,
        default: {},
    },
    description: { type: String, required: true },
    inStock: { type: Number, required: true, default: 0, min: 0 }
}, { timestamps: true });

// Pre-save hook to check stock level
productSchema.pre('save', async function (next) {
    const product = this;
    if (product.isModified('inStock') && product.inStock <= 5) {
        await sendStockAlert(product); // Trigger alert if stock is below or equal to 5
    }
    next();
});

// Method to fetch valid categories from the database
productSchema.statics.getValidCategories = async function () {
    const categories = await Category.find();
    return categories.map(cat => cat.name);
};

// Function to send email alert
async function sendStockAlert(product) {
    // Set up nodemailer transporter (use your email service details)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    // Send email alert to admin
    const mailOptions = {
        from: EMAIL_USER,
        to: 'thestore862@gmail.com',
        subject: `Low Stock Alert: ${product.name}`,
        text: `The stock for the product "${product.name}" is low. Only ${product.inStock} items left. Please restock soon.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Stock alert email sent successfully!');
    } catch (error) {
        console.error('Error sending stock alert email:', error);
    }
}

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

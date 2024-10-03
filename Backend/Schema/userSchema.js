// const mongoose = require("mongoose");
// const Product = require("./productSchema")

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     username: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     banned: {
//         type: Boolean,
//         default: false
//     },

//     cart:
//         [
//             {
//                 // product: {
//                 //     type: mongoose.Schema.Types.ObjectId,
//                 //     ref: 'Product',
//                 //     required: true
//                 // },
//                 id: {
//                     type: String,
//                     required: true
//                 },

//                 // Optional fields
//                 name: {
//                     type: String,
//                     required: true

//                 },
//                 price: {
//                     type: Number,
//                     required: true

//                 },

//                 image: {
//                     type: String,
//                     required: true

//                 },
//                 category: {
//                     type: String,
//                     required: true

//                 },
//                 quantity: {
//                     type: Number,
//                     required: true,
//                     min: 1
//                 }

//             }
//         ],

//     // cart: {
//     //     type: Array,
//     //     required: false
//     // },
//     orders: {
//         type: Array,
//         required: false,
//         default: Date.now
//     }, // Embed orders within the User schema
//     date: {
//         type: Date,
//         default: Date.now
//     },
//     address: [
//         {
//             house: {
//                 type: String
//             },
//             street: {
//                 type: String
//             },
//             city: {
//                 type: String
//             },
//             pin: {
//                 type: Number
//             },
//             phone: {
//                 type: Number
//             },
//             // required: false
//         }
//     ]
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;

//code frmsahahin
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true // Ensure email is unique
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     banned: {
//         type: Boolean,
//         default: false
//     },
//     isLoggedIn: {
//         type: Boolean,
//         default: false
//     },
//     cart: [
//         {
//             product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//             quantity: { type: Number, default: 1 },
//             name: String,
//             price: Number,
//             image: String,
//             brand: String,
//             category: String
//         }
//     ],
//     wishlist: [
//         {
//             product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//             name: String,
//             price: Number,
//             image: String,
//             brand: String,
//             category: String

//         }
//     ],
//     orders: {
//         type: Array,
//         required: false,
//         default: []
//     }
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

// userSchema.js
const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
    items: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        name: { type: String },
        price: { type: Number },
        image: { type: String },
        category: { type: String }
    }],
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
    // Add other order fields as necessary
});

// Define the User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    tempaddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    banned: { type: Boolean, default: false },
    wishlist: {
        type: Array
    },
    cart: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        name: { type: String },
        price: { type: Number },
        image: { type: String },
        category: { type: String }
    }],
    orders: [orderSchema] // Use the defined Order schema
});

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const Product = require('../Schema/productSchema');
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/projectDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Your product data
const products = [
    {
        image: "http://example.com/image1.jpg",
        name: "Smartphone",
        brand: "BrandA",
        price: 299.99,
        category: "electronics",
        description: "A high-quality smartphone."
    },
    {
        image: "http://example.com/image2.jpg",
        name: "T-shirt",
        brand: "BrandB",
        price: 19.99,
        category: "clothes",
        description: "A comfortable cotton t-shirt."
    },
    {
        image: "http://example.com/image3.jpg",
        name: "Sneakers",
        brand: "BrandC",
        price: 89.99,
        category: "footwear",
        description: "Stylish and comfortable sneakers."
    }
];

// Insert products into the database
Product.insertMany(products)
    .then(docs => {
        console.log('Products inserted:', docs);
        mongoose.connection.close(); // Close the connection when done
    })
    .catch(err => {
        console.error('Error inserting products:', err);
        mongoose.connection.close(); // Close the connection in case of error
    });


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_data: {
        type: Array,
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        // required:true
    }
});

const Order = mongoose.model('User', orderSchema);
module.exports = Order;

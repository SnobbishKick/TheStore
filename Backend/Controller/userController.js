const nodemailer = require('nodemailer');
const User = require("../Schema/userSchema");
const Product = require("../Schema/productSchema");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EMAIL_USER = "amalajijkl@gmail.com";
const EMAIL_PASS = "lvjr ccnh thqh gcwu";
const jwtSecretKey = "amal123";
// const CartItem = mongoose.model('CartItem', {
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//     quantity: { type: Number, default: 1 },
//   });

// const Wishlist = mongoose.model('Wishlist', {
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
// });


const createUser = async (req, res) => {
    try {
        // Check for existing user
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists." }); // Only send one response
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create user
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
        });

        // Send successful response (consider sending created user data)
        res.json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" }); // Use consistent error message properties
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // Check if the user is banned
            if (user.banned) {
                return res.status(403).json({ error: 'Login unsuccessful, you have been banned by admin', success: false });
            }

            // Compare passwords
            const comparePswd = await bcrypt.compare(req.body.password, user.password);

            if (comparePswd) {
                const authToken = jwt.sign({ email: user.email }, jwtSecretKey, { expiresIn: '1m' });
                res.json({ success: true, authToken, user, userId: user._id });
                console.log("AuthToken:", authToken);
            } else {
                res.status(400).json({ error: 'Incorrect password!', success: false });
            }
        } else {
            res.status(404).json({ error: 'User not found', success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const userForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        const token = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "1d" });
        console.log("token from forgotpassword",token);
        

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `Please use the following link to reset your password: http://localhost:3000/resetpassword/${user._id}/${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Failed to send email' });
            }
            res.json({ success: true, message: 'Password reset email sent successfully' });
        });
    } catch (error) {
        console.error('Error in forgot password process:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const userResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        // Check if password is provided
        if (!password) {
            return res.status(400).json({ Status: "Error", message: "Password is required" });
        }

        // Verify the token
        const decoded = jwt.verify(token, jwtSecretKey);
        console.log('Decoded Token:', decoded);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        // Update the user with the new password
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword });
        console.log('Password updated successfully');

        // Send a success response
        res.json({ Status: "Success" });
        // res.status(200).json({ Status: "Success" });

    } catch (err) {
        console.error('Error details:', err);

        if (err.name === 'JsonWebTokenError') {
            console.error('Invalid token:', err);
            return res.status(400).json({ Status: "Error", message: "Invalid token" });
        }

        if (err.name === 'CastError') {
            console.error('Invalid user ID:', err);
            return res.status(400).json({ Status: "Error", message: "Invalid user ID" });
        }

        console.error('Unexpected error:', err);
        res.status(500).json({ Status: "Error", message: "An error occurred while resetting the password" });
    }
};


const getUser = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        console.log("user", users);

        res.status(200).json({ userData: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        // console.log("req.params@ getUserById", req.params);
        const user = await User.findById(id);  // Use correct method and query by ID
        // console.log("user at getById", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};




// i dont know if i need it right now so i will leave it be....

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, tempaddress } = req.body;

        // Prepare the update data
        let updatedData = { address, tempaddress };

        // Update user in the database
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser); // Return the updated user details
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { name, username, email, password, address } = req.body;

    try {
        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;

        // Only update password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update address
        if (address) {
            user.address = {
                street: address.street || user.address.street,
                city: address.city || user.address.city,
                state: address.state || user.address.state,
                postalCode: address.postalCode || user.address.postalCode,
                country: address.country || user.address.country
            };
        }

        // Save updated user
        const updatedUser = await user.save();
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const placeOrder = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const { items, orderDetails } = req.body;

        if (!Array.isArray(items) || !items.length) {
            return res.status(400).send('No items provided');
        }

        if (!orderDetails || typeof orderDetails !== 'object') {
            return res.status(400).send('Invalid order details');
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        // Validate stock for each product and update stock
        for (const item of items) {
            const product = await Product.findById(item.product_id || item._id);

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
            }

            if (product.inStock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for product with ID ${item.product_id}` });
            }

            // Reduce stock and save product
            product.inStock -= item.quantity;
            await product.save();

            if (product.inStock < 5) {
                // Notify admin for low stock (optional logic)
            }
        }

        // Create the new order object
        const newOrder = {
            items: items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
                image: item.image,
                category: item.category
            })),
            ...orderDetails,
            status: 'pending', // Status is "pending" until admin approves
            createdAt: new Date()
        };

        // Add the new order to the user's orders
        user.orders.push(newOrder);

        // Remove items from the cart
        user.cart = user.cart.filter(cartItem => !items.some(item => item.product_id.toString() === cartItem.product_id.toString()));

        // Save the user document
        await user.save();

        res.status(200).json({ message: 'Order pending', orderId: newOrder._id });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Server error');
    }
};





const banUser = async (req, res) => {
    const { id } = req.params;

    try {
        const banneduser = await User.findByIdAndUpdate(id, { banned: true }, { new: true });
        if (!banneduser) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json({ message: 'User Banned successfully', banneduser });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const unbanUser = async (req, res) => {
    const { id } = req.params;

    try {
        const unbannedUser = await User.findByIdAndUpdate(id, { banned: false }, { new: true });
        if (!unbannedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User Unbanned successfully', unbannedUser });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


// const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await User.findByIdAndDelete(id)
//         res.status(200).send("User Deleted successfully")
//     } catch (error) {
//         console.log(error)
//     }
// }

const addCartItem = async (req, res) => {
    const { storedUserEmail, productId, quantity } = req.body;

    // console.log("reqbody", req.body);
    try {
        const user = await User.findOne({ email: storedUserEmail });

        // console.log("user@ addto cart", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);
        // console.log("product @add to cart",product);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingItem = user.cart.find(item => item.product_id.equals(productId));
        // console.log("existingItem @add to cart",existingItem);

        if (existingItem) {
            return res.status(400).json({ message: "Product already exists in the cart" });
        } else {
            user.cart.push({
                product_id: productId,
                quantity: quantity || 1,// Default quantity to 1 if not provided
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });
        }

        await user.save();
        return res.status(200).json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



// const getCartItem = async (req, res) => {
// //by mithun sir
//     const { email } = req.query;

//     try {
//         // Find the user by email and populate product details in the cart
//         const user = await User.findOne({ email }).populate({
//             path: 'cart.product',  // Assuming cart.product is the reference field
//             model: 'Product'
//         });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         // Calculate the total amount using the product price from the populated data
//         const totalAmount = user.cart.reduce((total, item) => {
//             const product = item.product; // Access the populated product
//             if (product) {
//                 return total + (product.productPrice * item.quantity);
//             }
//             return total;
//         }, 0);

//         res.status(200).send({ cart: user.cart, totalAmount });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'An error occurred while fetching the cart' });
//     }
// };


// const getCartItem = async (req, res) => {
//     const { storedUserEmail } = req.query;

//     try {
//       // Find the user by email
//       const user = await User.findOne({ email: storedUserEmail });

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       if (user.cart.length === 0) {
//         return res.status(200).json({ cartData: [], totalAmount: 0 });
//       }

//       // Fetch product details if not included in cart
//       const productIds = user.cart.map(item => item.product_id);
//       const products = await Product.find({ _id: { $in: productIds } });

//       // Create a map for quick lookup
//       const productMap = products.reduce((map, product) => {
//         map[product._id] = product;
//         return map;
//       }, {});

//       // Map cart items with product details
//       const cartData = user.cart.map(item => ({
//         ...item,
//         ...(productMap[item.product_id] || {})
//       }));

//       // Calculate total amount
//       const totalAmount = cartData.reduce((total, item) => {
//         if (typeof item.price === 'number' && typeof item.quantity === 'number') {
//           return total + (item.price * item.quantity);
//         } else {
//           console.error('Price or quantity missing for cart item:', item);
//           return total;
//         }
//       }, 0);

//       res.status(200).json({ cartData, totalAmount });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'An error occurred while fetching the cart' });
//     }
//   };


const getCartItem = async (req, res) => {
    const { storedUserEmail } = req.body;
    // console.log("req.body @ get cart",req.body);

    try {
        const user = await User.findOne({ email: storedUserEmail });
        console.log("user @ get cart", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};




// const updateQuantity = async (req, res) => {
//     const { storedUserEmail, productId, quantity } = req.body;

//     if (!storedUserEmail || !productId || typeof quantity !== 'number') {
//         return res.status(400).json({ message: 'userEmail, productId, and quantity are required' });
//     }

//     try {
//         // Find the user by email and cart item by product_id
//         const user = await User.findOne({ email: storedUserEmail });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Find the cart item and update its quantity
//         const cartItem = user.cart.find(item => item.product_id.toString() === productId);

//         if (!cartItem) {
//             return res.status(404).json({ message: 'Cart item not found' });
//         }

//         cartItem.quantity = quantity;

//         // Save the updated user
//         await user.save();

//         res.status(200).json({ message: 'Cart item quantity updated', cart: user.cart });
//     } catch (error) {
//         console.error("Error in updateCartItemQuantity:", error); // Detailed error logging
//         res.status(500).json({ message: 'Failed to update cart item quantity', error });
//     }
// };


const updateQuantity = async (req, res) => {
    const { storedUserEmail, productId, newQuantity } = req.body;
    console.log("console@quantitychange", storedUserEmail, productId, newQuantity);

    // const P

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }


    if (newQuantity <= 0) {
        console.log("console@quantitychange", storedUserEmail, productId, newQuantity);

        return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    try {
        const user = await User.findOne({ email: storedUserEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingItem = user.cart.find(item => item.product_id.equals(productId));
        // console.log("existingItem @ update",existingItem);
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



// const updateQuantity = async (req, res) => {
//     const { productId, quantity, storedUserEmail } = req.body;
//     console.log("req.body @UpdateBackend", req.body);

//     try {
//         // User Authentication (replace with your actual mechanism)
//         const user = await User.findOne({ email: storedUserEmail });
//         console.log("user @ UpdateBackend", user);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Item Search and Quantity Update
//         const existingItem = user.cart.find(item => item.product_id.equals(productId));
//         console.log("existing item @updateBackend", existingItem);
//         if (!existingItem) {
//             return res.status(404).json({ message: "Item not found in cart" });
//         }

//         // Data Validation
//         if (quantity <= 0 || !Number.isInteger(quantity)) {
//             return res.status(400).json({ message: "Invalid quantity" });
//         }

//         // existingItem.quantity.product_id = quantity;

//         const updatedUser = await User.findOneAndUpdate(
//             { _id: user._id, "cart.product_id": productId },
//             { $set: { "cart.$": existingItem } }, // Update cart subdocument
//             { new: true } // Return the updated user object
//         );
//         if (!updatedUser) { // Check if Correction 2 was used
//             await user.save();
//           }

//         // Save User (assuming Mongoose handles saving subdocuments)
//         await user.save();

//         res.json(user.cart); // Respond with updated cart
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

//   const updateQuantity = async (req, res) => {
//     const { productId, quantity,storedUserEmail } = req.body;

//     try {
//       const user = await User.findOne({ email: storedUserEmail }); // Assuming storedUserEmail is used
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const existingItem = user.cart.find(item => item.product_id.equals(productId));

//       if (!existingItem) {
//         return res.status(404).json({ message: "Item not found in cart" });
//       }

//       existingItem.quantity = quantity; // Update quantity
//       await user.save();
//       res.json(user.cart);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   };

// const removeCartItem = async (req, res) => {
//     const { storedUserEmail, productId } = req.body;

//     try {
//       const user = await User.findOne({ email: storedUserEmail });

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Find the cart item to remove
//       const cartItemIndex = user.cart.findIndex(item => item.product_id === productId);

//       if (cartItemIndex !== -1) {
//         user.cart.splice(cartItemIndex, 1);
//         await user.save();
//         return res.status(200).json({ message: 'Item removed from cart' });
//       } else {
//         return res.status(404).json({ message: 'Cart item not found' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to remove item from cart', error });
//     }
//   }


const removeCartItem = async (req, res) => {
    const { storedUserEmail, productId } = req.body;

    try {
        // console.log("Request body:", req.body); // Log request body
        console.log("productId", productId);


        // Validate input
        if (!storedUserEmail) {
            return res.status(400).send("Email ID are required");
        }
        if (!productId) {
            return res.status(400).send("product ID are required");
        }

        // Check if the product ID is valid
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send("Invalid product ID");
        }

        // Fetch user by email
        const user = await User.findOne({ email: storedUserEmail });
        if (!user) {
            return res.status(404).send("User not found");
        }

        console.log("User found:", user); // Log user object

        // Find index of the item to remove
        const itemIndex = user.cart.findIndex(item =>
            item.product_id && item.product_id.toString() === productId
        );

        console.log("Item index:", itemIndex); // Log item index

        if (itemIndex === -1) {
            return res.status(404).send("Item not found in cart");
        }

        // Remove the item from the cart
        user.cart.splice(itemIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        console.error("Error in removeCartItem:", error);
        res.status(500).json({ message: 'Failed to remove item from cart', error });
    }
};
// const removeCartItem = async (req, res) => {
//     const { storedUserEmail, productId } = req.body;
//     console.log("req.body @ removeitem", req.body);

//     try {
//         const user = await User.findOne({ email: storedUserEmail });

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         user.cart = user.cart.filter(product => product._id.toString() !== productId);
//         await user.save();

//         console.log("cart",user.cart);

//         res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
//     } catch (error) {
//         console.error("Error in removeCart:", error);
//         res.status(500).json({ message: 'Failed to remove item from cart', error });
//     }
// };




// const removeCartItem = async (req, res) => {
//     const { storedUserEmail,productId } = req.body;
//     console.log("req.body @removeCartItem",req.body)

//     try {
//         const user = await User.findOne({ email: storedUserEmail }); // Assuming storedUserEmail is used
//         console.log("user @removeCartItem",user)
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const existingItem = user.cart.find(item => item.product_id.equals(productId));
// console.log("existingItem @removeCartitem",existingItem)
//         if (!existingItem) {
//             return res.status(404).json({ message: "Item not found in cart" });
//         }

//         else {
//             user.cart.pull(existingItem); // Remove item from cart array
//         }

//         await user.save();
//         res.json(user.cart); // Send updated cart data
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// Add to Wishlist route

// const addToWishlist = async (req, res) => {
//     try {
//         const { storedUserEmail,productId } = req.body;
//         console.log("req.body at addwishlist",req.body)
//         const user = await User.findone({email: storedUserEmail});

//         // Check if the product is already in the wishlist
//         if (user.wishlist.includes(productId)) {
//             return res.status(400).json({ message: 'Product already in wishlist' });
//         }

//         user.wishlist.push(productId);
//         await user.save();

//         res.status(200).json({ message: 'Product added to wishlist' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

const addToWishlist = async (req, res) => {
    try {
        const { storedUserEmail, product } = req.body;
        const user = await User.findOne({ email: storedUserEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundproduct = await Product.findById({ _id: product._id });
        if (!foundproduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        user.wishlist.push(product);

        await user.save();

        res.status(200).json({ message: "Product added to wishlist" });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const removeWishlist = async (req, res) => {
    const { storedUserEmail, productId } = req.body;
    console.log("req.body@removewishlist", req.body);


    try {
        if (!storedUserEmail || !productId) {
            return res.status(400).json({ message: 'userEmail and productId are required' });
        }

        console.log("Removing product from wishlist", { storedUserEmail, productId });

        const user = await User.findOne({ email: storedUserEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        console.log("Current wishlist:", user.wishlist);


        const productInWishlist = user.wishlist.find(item => item._id.toString() === productId);
        if (!productInWishlist) {
            return res.status(404).json({ message: 'Item not found in wishlist' });
        }

        user.wishlist = user.wishlist.filter(item => item._id.toString() !== productId);
        await user.save();

        console.log("Updated wishlist:", user.wishlist);

        res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getWishlist = async (req, res) => {
    const { storedUserEmail } = req.body;

    try {
        const user = await User.findOne({ email: storedUserEmail }).populate('wishlist.product_id');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createUser, loginUser,userForgotPassword,userResetPassword, updateUser, updateUserDetails,
    // deleteUser, 
    getUser, getUserById, placeOrder, banUser, unbanUser, addToWishlist, removeWishlist, getWishlist, addCartItem, getCartItem, updateQuantity, removeCartItem
}
const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
// const  = require('../Config/'); // Middleware for authentication and authorization

// Route for creating a new user
router.post('/createuser', userController.createUser);

// Route for user login
router.post('/loginuser', userController.loginUser);

// Route for forgot password
router.post('/forgotpassword', userController.userForgotPassword);

// Route for resetting password
router.put('/resetpassword/:id/:token', userController.userResetPassword);

// Route for getting all users (protected, admin access only)
router.get('/getuser', userController.getUser);

// Route for getting a user by ID
router.get('/:id', userController.getUserById);

// Route for updating user details (address and temporary address)
router.put('/update/:id',  userController.updateUser);

// Route for updating user details (full details including address)
router.put('/updatemyprofile/:id',  userController.updateUserDetails);

// Route for placing an order
router.post('/:id/placeorder',  userController.placeOrder);

// Route for banning a user (admin access only)
router.put('/:id/ban',  userController.banUser);

// Route for unbanning a user (admin access only)
router.put('/:id/unban',  userController.unbanUser);

// Route for adding an item to the cart
router.post('/addcart', userController.addCartItem);
router.post('/updatequantity', userController.updateQuantity);
// Route for getting cart items
router.post('/getcart', userController.getCartItem);
router.post('/removeCart',userController.removeCartItem)

router.post('/removewishlist',userController.removeWishlist)
router.post('/addtowishlist',userController.addToWishlist)


module.exports = router;

const express = require("express");

const router = express.Router();


const adminController = require('../Controller/adminController');

router.post('/login',adminController.adminlogin);
router.get('/register', adminController.adminregister);
router.post('/adminlogin', adminController.adminlogin);
router.post('/addcategory', adminController.addCategory);

router.post('/:userId/approveorders/:orderId',adminController.approveOrder)
router.get('/pendingorders',adminController.getPendingOrder)
router.post('/addsubcategory', adminController.addSubCategory);
router.post('/addtypes', adminController.addTypes);

router.get('/getcategories', adminController.getCategories);  // Fetch all categories

module.exports = router;
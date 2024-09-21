const User = require("../Schema/userSchema");


const addToCart = async (req, res) => {
    const { userId, product_id, name, price, qty, size, imgUrl, date } = req.body
    // console.log('Request received:', req.body);

    try {
        const user = await User.findOne({ _id: userId });
        // console.log("user", user);

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        const existingCartitem = await user.cart.find(item => item.product_id === product_id)

        if (existingCartitem) {
            existingCartitem.qty += qty
            existingCartitem.size = size
        }
        else {
            user.cart.push({ foodItemId, name, price, qty, size, imgUrl, date })
        }
        await user.save()
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

module.exports={ addToCart}
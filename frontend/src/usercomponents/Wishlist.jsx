import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { MyContext } from '../Mycontext';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import { TiShoppingCart } from "react-icons/ti";
import { IoHeartDislikeSharp } from "react-icons/io5";

const Wishlist = () => {
  const { cartItems, setCartItems, wishlistItems, userToken, storedUserEmail, setWishlistItems, serverURL } = useContext(MyContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  // Add to cart handler
  async function handleCart(productId) {
    if (!userToken) {
      alert("Please Login First");
    } else {
      try {
        const response = await axios.post(`${serverURL}/api/users/addcart`, {
          productId: productId,
          storedUserEmail: storedUserEmail,
          quantity: 1
        });
        setCartItems(response.data);
        alert("Your Product is added to the Cart");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert(error.response.data.msg);
        } else if (error.response && error.response.status === 400) {
          alert("This product already exists in the cart");
        } else {
          alert("An error occurred while adding the product.");
        }
      }
    }
  }

  // Remove from wishlist handler
  const dislikebtn = async (product) => {
    try {
      const response = await axios.post(`${serverURL}/api/users/removeWishlist`, {
        // data: {
          storedUserEmail: storedUserEmail,
          productId: product._id,
        // },
      });

      if (response.status === 200) {
        setWishlistItems(wishlistItems.filter(item => item._id !== product._id));
        fetchWishlist(); // Refresh wishlist
        alert("Item removed from Wishlist");
      } else {
        alert("Failed to remove item from Wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update Wishlist");
    }
  };

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      if (!storedUserEmail) {
        throw new Error("User email is not provided");
      }

      const response = await axios.post(`${serverURL}/api/users/getwishlist`, {
        storedUserEmail: storedUserEmail,
      });

      if (response.status === 200) {
        setWishlist(response.data.wishlist);
      } else {
        throw new Error("Failed to fetch wishlist");
      }
    } catch (error) {
      setError("Failed to fetch wishlist");
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : wishlist.length > 0 ? (
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div className="wishlist-card" key={product._id}>
              <div className="wishlist-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="wishlist-details">
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Brand:</strong> {product.brand || "Unknown"}</p>
                <p><strong>Category:</strong> {product.category || "Unknown"}</p>
                
                <div className="button-container">
                  <button
                    onClick={() => handleCart(product._id)}
                    className="icon-button">
                    {cartItems.find(cartItem => cartItem._id === product._id) ? <TiShoppingCart style={{ color: "black", width: "35px", height: "30px" }} /> : <TiShoppingCart style={{ width: "35px", height: "30px" }} />}
                  </button>
                  <button
                    onClick={() => dislikebtn(product)}
                    className="icon-button">
                    <IoHeartDislikeSharp style={{ width: "35px", height: "30px" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
          <p>Move your liked products from the list of products to the Wishlist page for easy shopping.</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

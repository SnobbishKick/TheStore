import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ProductDetails.css'; // Import your CSS for styling

function ProductDetails() {
   const navigate = useNavigate();
   const { productId } = useParams();
   const [product, setProduct] = useState(null);
   const [similarProducts, setSimilarProducts] = useState([]);
   const [isSidebarVisible, setSidebarVisible] = useState(false);
   const [quantity, setQuantity] = useState(1); // State for quantity
   const serverURL = 'http://localhost:5550'; // Adjust server URL

   useEffect(() => {
      // Fetch product details
      const fetchProduct = async () => {
         try {
            const response = await axios.get(`${serverURL}/api/products/${productId}`);
            setProduct(response.data);

            // Fetch similar products
            const similarResponse = await axios.get(`${serverURL}/api/products/similar/${response.data.category}`);
            setSimilarProducts(similarResponse.data);
         } catch (error) {
            console.error('Error fetching product details:', error);
         }
      };

      fetchProduct();
   }, [productId]);

   const handleQuantityChange = (e) => {
      setQuantity(Number(e.target.value));
   };

   // Add to Cart Functionality
   const addToCart = async () => {
      if (quantity <= 0) {
         alert("Please select a valid quantity.");
         return;
      }
      try {
         await axios.post(`${serverURL}/api/users/addcart`, {
            productId: product._id,
            quantity: quantity
         });
         alert("Product added to cart!");
      } catch (error) {
         console.error('Error adding to cart:', error);
      }
   };

   // Buy Now Functionality (Redirecting to Payment Page directly)
   const buyNow = () => {
      if (quantity <= 0) {
         alert("Please select a valid quantity.");
         return;
      }
      // Navigate to the PaymentPage, passing product details and quantity in state
      navigate("/PaymentPage", { state: { selectedItems: [{ ...product, quantity }] } });
   };

   if (!product) return <div>Loading...</div>;

   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
   };

   return (
      <div>
         <div className="productdetail" style={{ width: "100%" }}>
            <div className='imgleft'>
               <img src={product.image} style={{ width: "-webkit-fill-available", marginTop: "" }} alt={product.name} />
            </div>
            <div className='detlmiddle'>
               <h1>{product.name}</h1>
               <p>Brand: {product.brand}</p>
               <p>Price: ₹{product.price}</p>
               <p>Description: {product.description}</p>
               <p>In Stock: {product.inStock}</p>
               <label htmlFor="quantity">Quantity:</label>
               <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
               />
            </div>
            <div className='buynowright'>
               <button onClick={addToCart}>Add to Cart</button>
               <button onClick={buyNow}>Buy Now</button>
            </div>
         </div>
         <button
            className="sidebar-toggle"
            onClick={() => setSidebarVisible(!isSidebarVisible)}
         >
            {isSidebarVisible ? 'Hide Similar Products' : 'Show Similar Products'}
         </button>

         <div className={`sidebar-content ${isSidebarVisible ? 'visible' : ''}`}>
            <h2>Similar Products</h2>
            <Slider {...settings}>
               {similarProducts.map(p => (
                  <div key={p._id} className="product-card">
                     <img src={p.image} alt={p.name} />
                     <p>{p.name}</p>
                     <p>₹{p.price}</p>
                  </div>
               ))}
            </Slider>
         </div>
      </div>
   );
}

export default ProductDetails;

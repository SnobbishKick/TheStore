import React from 'react';
import { useContext } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {MyContext} from '../Mycontext'
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // Number of items to slide on each arrow click
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ProductCarousel = ({  }) => {
   const { roducts, handleAddtoCart, addToWishlist,loginStatus, setLoginStatus, storedUserEmail, userToken,liked,setLiked,product, products, searchInput, query, setProducts, serverURL, cartItems, setCartItems, removeFromWishList, setWishlistItems, wishlistItems } = useContext(MyContext)

  return (
    <Carousel responsive={responsive}>
      <ul className="display">
        {products.map((product) => (
          <div className='imgp' key={product._id}>
            <p>
              <img
                src={product.image}
                alt={product.name}
              />
            </p>
            <p>Name: <b>{product.name}</b></p>
            <p>Price: <b>₹{product.price}</b></p>
            <p>Category: <b>{product.category}</b></p>
            <div className='pdbtns'>
              <button className='addtocartbtn' onClick={() => handleAddtoCart(product._id)}>
                {cartItems.includes(product._id) ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                className="WishListBtn"
                onClick={() => addToWishlist(product)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
                {wishlistItems.some(item => item.productId === product._id) ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        ))}
      </ul>
    </Carousel>
  );
};

export default ProductCarousel;

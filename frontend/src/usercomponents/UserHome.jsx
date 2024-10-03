import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MyContext } from '../Mycontext';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import Footer from '../Footer';
import '../usercomponents/UserHome.css';

function UserHome() {
  const {
    storedUserEmail,
    userToken,
    serverURL,
    cartItems,
    setCartItems,
    wishlistItems,
    filters,
    products, setProducts,
    sortOption
  } = useContext(MyContext);

  // const [] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error handling
  // const productsPerPage = 10;

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     setError(null); // Reset error state
  //     try {
  //       const response = await axios.get(`${serverURL}/api/products/getproduct`

  //       // const response = await axios.get(`${serverURL}/api/products/getsome`, {
  //       //   params: {
  //       //     page: currentPage,
  //       //     limit: productsPerPage,
  //       //     ...filters,
  //       //     sort: sortOption
  //       //   }});
  //       );

  //       setProducts(response.data.products || []);
  //       setTotalPages(response.data.totalPages);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //       setError('Failed to load products.'); // Set error message
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [currentPage, filters, sortOption]);



  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddToCart = async (product) => {
    if (!userToken) {
      alert('Please Login First');
      return;
    }
    if (product.inStock === 0) {
      alert('This product has been sold out');
      return;
    }
    try {
      const response = await axios.post(`${serverURL}/api/users/addcart`, {
        productId: product._id,
        storedUserEmail: storedUserEmail,
        quantity: 1
      });
      setCartItems(response.data);
      alert('Your Product is added to the Cart');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.msg);
      } else if (error.response && error.response.status === 400) {
        alert('This product already exists in the cart');
      } else {
        alert('An error occurred while adding the product.');
      }
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (wishlistItems.some(item => item.productId === product._id)) {
        await axios.post(`${serverURL}/api/users/removewishlist`, {
          storedUserEmail: storedUserEmail,
          productId: product._id
        });
        alert('Item removed from Wishlist');
      } else {
        await axios.post(`${serverURL}/api/users/addtowishlist`, {
          storedUserEmail: storedUserEmail,
          product
        });
        alert('Item added to Wishlist');
      }
    } catch (error) {
      alert('Failed to update wishlist');
    }
  };

  

  return (
    <div>
      <Carousel data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://img.freepik.com/free-vector/electronics-store-template-design_23-2151143839.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h5>First slide label</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://www.shutterstock.com/image-vector/super-sale-header-banner-design-260nw-1663164736.jpg"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAJspA-f8G_-TknyBtyEkoASZG7DS63Xkr7P1E5s-s49P3pWOH4BIjVYrmriXwJAIm-s&usqp=CAU"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h5>Third slide label</h5>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* <h1>New Arrivals</h1> */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>} {/* Display error message */}
      {!loading && !error && (
        <ul className="display">
          {products.map((product) => (
            <div className="imgp" key={product._id}>
              <Link to={`/product/${product._id}`} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                />
              </Link>
              <p>Name: <b>{product.name}</b></p>
              <p>Price: <b>₹{product.price}</b></p>
              <p>Category: <b>{product.category}</b></p>
              {product.inStock === 0 ? (
                <p className="stock-out">Out of Stock</p>
              ) : (
                <p className="stock-in">In Stock</p>
              )}
              <div className="pdbtns">
                <button className="addtocartbtn" onClick={() => handleAddToCart(product)}>
                  {cartItems.some(item => item._id === product._id) ? "Added to Cart" : "Add to Cart"}
                </button>
                <button className="WishListBtn" onClick={() => addToWishlist(product)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                  </svg>
                  {wishlistItems.some(item => item.productId === product._id) ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}

      {/* <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
<div>
  {

  }
</div>
      {/* <Footer /> */}

    </div>
  );
}

export default UserHome;

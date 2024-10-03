import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SortPanel from './SortPanel'; // Ensure you import the SortPanel component
import { MyContext } from '../Mycontext';

function Dummyuserhome() {
    const {products,
      setProducts,} = useContext(MyContext)
   //  const [products, setProducts] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState({});
    const [quantities, setQuantities] = useState({});
    const [sortOrder, setSortOrder] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');

    const userToken = localStorage.getItem('userToken');
    const userEmail = localStorage.getItem('userEmail');

   //  useEffect(() => {
   //      getProducts();
   //  }, []);

   //  const getProducts = async () => {
   //      try {
   //          const response = await axios.get("http://localhost:5550/api/products/getproduct");
   //          setProducts(response.data.productData);
   //      } catch (error) {
   //          console.log(error);
   //      }
   //  };

    const filteredProducts = products
        .filter(product => {
            if (priceFilter === 'under500') return product.productPrice < 500;
            if (priceFilter === '500to1000') return product.productPrice >= 500 && product.productPrice <= 1000;
            if (priceFilter === 'above1000') return product.productPrice > 1000;
            return true;
        })
        .filter(product => {
            if (brandFilter) return product.productBrand === brandFilter;
            return true;
        });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === 'priceLowToHigh') return a.productPrice - b.productPrice;
        if (sortOrder === 'priceHighToLow') return b.productPrice - a.productPrice;
        return 0; // No sorting
    });

    const handleSortChange = (value) => {
        setSortOrder(value);
    };

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'priceFilter') {
            setPriceFilter(value);
        } else if (filterType === 'brandFilter') {
            setBrandFilter(value);
        }
    };

   //  const handleSizeChange = (productId, size) => {
   //      setSelectedSizes({
   //          ...selectedSizes,
   //          [productId]: size
   //      });
   //  };

    const handleQuantityChange = (productId, quantity) => {
        setQuantities({
            ...quantities,
            [productId]: quantity
        });
    };

    const handleAddToCart = async (product) => {
      //   const selectedSize = selectedSizes[product._id];
        const quantity = quantities[product._id] || 1;

      //   if (!selectedSize) {
      //       alert('Please select a size');
      //       return;
      //   }

        try {
            await axios.post("http://localhost:5550/api/users/addtocart", {
                email: userEmail,
                productId: product._id,
               //  selectedSize: selectedSize,
                quantity: quantity
            });
            alert('Product added to cart successfully');
        } catch (error) {
            console.log(error);
            alert('Failed to add product to cart');
        }
    };

    return (
        <div className='container'>
            <SortPanel onSortChange={handleSortChange} onFilterChange={handleFilterChange} />
            <div className='row'>
                {/* {sortedProducts.map((product) =>  */}
                {products.map((product) => {

                    return (
                        <div className='col-6 col-md-3' key={product._id}>
                            <div className='card mb-4' style={{ boxShadow: "0px 0px 5px 0px grey" }}>
                                <div className='card-body'>
                                    <h3 className='card-title'>{product.productBrand}</h3>
                                    <h2 className='card-subtitle mb-2'>{product.name}</h2>
                                    <img src={product.image} alt={product.name} className='img-fluid' />
                                    <p><b>Price: ₹{product.price}/-</b></p>
                                    <p>{product.description}</p>
                                    {/* <p>Model: {product.productModel}</p> */}
                                    <div>
                                        <label>Size: </label>
                                        {/* <select style={{ width: "70px", border: `1px solid ${product.productColor}`, borderRadius: "5px", margin: "5px" }}
                                            value={selectedSizes[product._id] || ''}
                                            onChange={(e) => handleSizeChange(product._id, e.target.value)}
                                        > */}
                                            {/* <option value='' disabled>select</option>
                                            {product.productSize.map((size) => (
                                                <option key={size.size} value={size.size}>{size.size}</option>
                                            ))}
                                        </select> */}
                                    </div>
                                    <div>
                                        <label>Qty: </label>
                                        <input
                                            style={{ width: "50px", border: `1px solid ${product.productColor}`, borderRadius: "5px", margin: "5px" }}
                                            type='number'
                                            value={quantities[product._id] || 1}
                                            min='1'
                                            onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                        />
                                    </div>
                                    <button
                                        style={{ width: "100px", borderRadius: "5px", margin: "5px", boxShadow: "0px 0px 4px 0px grey" }}
                                        onClick={() => handleAddToCart(product)}>Add to cart</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Dummyuserhome;

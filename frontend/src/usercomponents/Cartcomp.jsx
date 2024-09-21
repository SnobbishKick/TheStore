import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../Mycontext';
import "./Cartcomp.css"
// import {myContext} from '../../Context';

function Cartcomp({ product }) {
  // const { 
  //   // cartItems, setCartItems 
  // } = useContext(UserContext);
  const { cartItems, setCartItems, products, } = useContext(MyContext)
  // const [cartTotal, setCartTotal] = useState(0);

  // useEffect(() => {

  //   const calculateCartTotal = () => {
  //     let totalAmount = 0;
  //     for (const item in cartItems){
  //       if(cartItems[item] > 0){
  //         let itemInfo = products.find((product) => product.id === Number(item)) ;
  //         totalAmount += cartItems[item]*itemInfo.price

  //       }setCartTotal(calculateCartTotal());
  //     }return totalAmount
  //   }
  // })

  const handleRemove = (productId) => {
    // console.log("productId....==", productId);
    const updatedCart = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedCart);
    // console.log("cartItems123....==",cartItems);
  };
  console.log("cartItems....==", cartItems);


  const handleQuantityChange = (productId, newQuantity) => {
    const existingProductIndex = cartItems.findIndex((item) => item.id === productId);

    if (existingProductIndex !== -1) {
      // Product already exists in the cart, update the quantity
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex] = {
        ...updatedCart[existingProductIndex],
        quantity: newQuantity,
      };
      setCartItems(updatedCart);
    }
    else {
      // Product doesn't exist in the cart, add it
      const updatedCart = [
        ...cartItems,
        {
          ...product,
          quantity: newQuantity,
        },
      ];
      setCartItems(updatedCart);
    }
  };


  return (
    <div className='cartContainer'>
        {/* <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        
        <p>Price</p>
        <br />
        <p>Quantity</p>
        <br />
        <p>Total</p> */}
      <div className='productContainer'>
       {/* {
       product.map((product)=>{
        return(
          <div>
        <div className='imageContainer'>
          <img className="w-100" src={product.image} alt="" />
        </div>
        <div className='detailsContainer'>
        <h4>Name : {product.name}</h4>
          <h5>MRP: ₹{product.price}/-</h5>
        </div>
        </div>
       )})
      } */}
      <div className='imageContainer'>
          <img className="w-100" src={product.image} alt="" />
        </div>
        <div className='detailsContainer'>
        <h4>Name : {product.name}</h4>
          <h5>MRP: ₹{product.price}/-</h5>
        </div>
      </div>

      <div className='billContainer'>
        <h3 className='ProductTotal'> Quantity:</h3>
        <button className='minusBtn' onClick={() => handleQuantityChange(product.id, Math.max(1, (product.quantity || 1) - 1))}>-</button>
        <button>{product.quantity || 1}</button>
        <button className='plusBtn' onClick={() => handleQuantityChange(product.id, (product.quantity || 1) + 1)}>+</button>

        <h4 className='ProductTotal' Total>Product Total: ₹{(product.price || 0) * (product.quantity || 1)}/-</h4>
        {/* <p>Cart Total: ₹{cartTotal.toFixed(2)}/-</p> */}
        <button className='Remove' onClick={() => handleRemove(product.id)}>Remove</button>
      </div>
      
    </div>
  );
}

export default Cartcomp;
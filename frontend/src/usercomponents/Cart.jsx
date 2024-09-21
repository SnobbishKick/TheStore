import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../Mycontext';
import './Cart.css';

function Cart() {
  const [cartTotal, setCartTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { cartItems, setCartItems, storedUserEmail, userToken, products, serverURL } = useContext(MyContext);
  const navigate = useNavigate();

  const TAX_RATE = 0.02; // 2% tax rate
  const Shipping_charge = 75;

  const FetchUsersCart = async () => {
    if (!storedUserEmail || !userToken) {
      alert("Please login to view cart");
      return;
    }
    try {
      const response = await axios.post(`${serverURL}/api/users/getcart`, { storedUserEmail });
      setCartItems(response.data || []);
    } catch (error) {
      setError('Failed to fetch cart items');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchUsersCart();
  }, [storedUserEmail, userToken]);

  useEffect(() => {
    const calculateCartTotal = () => {
      let subtotal = 0;
      let totalTax = 0;

      selectedItems.forEach(item => {
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        const itemTax = price * quantity * TAX_RATE;
        subtotal += (price * quantity);
        totalTax += itemTax;
      });

      const finalTotal = subtotal + Shipping_charge + totalTax;

      setCartTotal(finalTotal);
      setTotalTax(totalTax);
    };

    calculateCartTotal();
  }, [selectedItems]);


  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const productResponse = await axios.get(`${serverURL}/api/products/${productId}`);
      const product = productResponse.data;

      if (newQuantity > product.inStock) {
        alert("Quantity exceeds available stock");
        return;
      }

      const updatedCart = cartItems.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);

      const updatedSelectedItems = selectedItems.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      setSelectedItems(updatedSelectedItems);

      // Send the updated quantity to the backend
      console.log("console@quantitychange in trycatch", storedUserEmail, productId, newQuantity);
      await axios.post(`${serverURL}/api/users/updatequantity`, {
        storedUserEmail: storedUserEmail,
        productId: productId,
        newQuantity: newQuantity
      });

    } catch (error) {
      alert("Failed to update cart quantity");
      console.error("Error updating quantity:", error);
    }
  };


  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${serverURL}/api/users/removeCart`, {
        data: { productId, storedUserEmail }
      });
      const updatedCartItems = cartItems.filter(item => item.product_id !== productId);
      setCartItems(updatedCartItems);
      setSelectedItems(selectedItems.filter(item => item.product_id !== productId));
      alert("Item removed from cart");
    } catch (error) {
      alert("Failed to remove item from cart");
      console.error("Error removing item:", error);
    }
  };

  const handleSelectionChange = (product) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.some(item => item.product_id === product.product_id)) {
        return prevSelectedItems.filter(item => item.product_id !== product.product_id);
      } else {
        return [...prevSelectedItems, product];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }
    navigate("/PaymentPage", { state: { selectedItems } });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="cart-container">
      <h1>Your Bag Items</h1>
      <div className="cart-content">
        <div className="cart-items">
          <div className="select-all">
            <input
              type="checkbox"
              style={{ width: "20px", height: "20px" }}
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <label>Select All</label>
          </div>
          {cartItems.length > 0 ? cartItems.map((product) => (
            <div key={product.product_id} className="cart-item">
              <input
                type="checkbox"
                style={{ width: "20px", height: "20px" }}
                checked={selectedItems.some(item => item.product_id === product.product_id)}
                onChange={() => handleSelectionChange(product)}
              />
              <img className="cart-item-image" src={product.image} alt={product.name} />
              <div className="description">
                <p className="product-name">{product.name || "No name available"}</p>
                <p className="product-brand">{product.brand}</p>
                <p className="product-price">Price: ₹{product.price}</p>
                <p className="product-description">{product.description || "No description available"}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(product.product_id, Math.max(1, (product.quantity || 1) - 1))}>-</button>
                  <span className="quantity">{product.quantity || 1}</span>
                  <button onClick={() => handleQuantityChange(product.product_id, (product.quantity || 1) + 1)}>+</button>
                </div>
                <div className="product-total">
                  <p>Original Amount: ₹{(product.price || 0) * (product.quantity || 1)}</p>
                  <p className="taxed-amount">Taxed Amount: ₹{((product.price || 0) * (product.quantity || 1) * TAX_RATE)}</p>
                </div>
                <button className="remove" onClick={() => handleRemove(product.product_id)}>Remove</button>
              </div>
            </div>
          )) : <h1>Your Shopping Bag is Empty</h1>}
        </div>
        <div className="cart-right">
          {cartItems.length > 0 && (
            <div className="checkout">
              <div className="checkout-total">
                <p>Subtotal (without tax): ₹{cartTotal - Shipping_charge - totalTax}</p>
                <p>Total Tax: ₹{totalTax}</p>
                <p>Shipping Charge: ₹{Shipping_charge}</p>
                <p>Cart Total (incl tax & shipping): ₹{cartTotal}</p>

                <div className="checkout-buttons">
                  <button onClick={() => navigate("/UserHome")}>Continue Shopping</button>
                  <button onClick={handleCheckout}>Checkout Selected</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;

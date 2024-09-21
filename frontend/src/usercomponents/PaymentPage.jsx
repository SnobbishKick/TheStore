import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MyContext } from '../Mycontext';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const SHIPPING_CHARGE = 75; // Example shipping charge
const TAX_RATE = 0.1; // Example tax rate (10%)

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serverURL, userId } = useContext(MyContext);

  const { selectedItems, product } = location.state || {}; // Retrieve selectedItems and product from state
  const [items, setItems] = useState(() => Array.isArray(selectedItems) ? selectedItems : (product ? [product] : []));
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTime, setOrderTime] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isExpanded, setIsExpanded] = useState({
    address: false,
    payment: false,
    summary: false
  });
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details', error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, serverURL]);

  useEffect(() => {
    console.log('Items:', items);
  }, [items]);

  const calculateTotal = () => {
    if (!Array.isArray(items)) {
      console.error('Items is not an array:', items);
      return 0; // Return a default value
    }
    return items?.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      const tax = itemTotal * TAX_RATE;
      return total + itemTotal + tax;
    }, 0) + SHIPPING_CHARGE || 0;
  };

  const totalPrice = calculateTotal();

  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate payment method
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order details
      const orderDetails = {
        orderTime: new Date().toLocaleString(),
        deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString(),
        // Add any other order-specific details you need
      };

      // Send request to place the order
      const response = await axios.post(`${serverURL}/api/users/${userId}/placeorder`, {
        items,
        orderDetails
      });

      // Check the response to determine if the order is pending
      if (response.data.message === 'Order pending') {
        // Set the state for pending order
        setIsProcessing(false);
        setSuccess(true);
        setInvoice({
          ...orderDetails,
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          })),
          total: calculateTotal(),
          status: 'Pending Approval'
        });

        // Simulate navigation back to the payment page to show invoice
        setOrderPlaced(true);
        setTimeout(() => {
          navigate('/PaymentPage'); // Replace with actual path if different
        }, 1000);
      } else {
        // Handle unexpected response or error
        console.error('Unexpected response:', response.data);
        setIsProcessing(false);
        alert('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
      alert('An error occurred while processing your payment. Please try again.');
    }
  };


  const handleDelete = (productId) => {
    setItems(items.filter(item => item._id !== productId));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveNewAddress = async () => {
    if (!user?._id) {
      console.error('User is not defined or missing _id');
      return;
    }

    const updatedAddress = {
      address: newAddress,
      tempaddress: user.address // Push the old address to temporary address if updating to a new one
    };

    try {
      await axios.put(`${serverURL}/api/users/update/${user._id}`, updatedAddress);
      setUser(prevUser => ({
        ...prevUser,
        address: newAddress
      }));
      console.log('New address saved successfully');
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleGoToCart = () => {
    navigate('/Cart'); // Replace with actual path to cart page
  };

  return (
    <div className="payment-page">
      {!success && !isProcessing && (
        <div className="payment-content">
          {/* Address Section */}
          <div className="expandable-section">
            <button
              className="expand-button active"
              onClick={() => setIsExpanded(prev => ({ ...prev, address: !prev.address }))}
            >
              Address {isExpanded.address ? '-' : '+'}
            </button>
            {isExpanded.address && (
              <div className="section-content address">
                {isEditingAddress ? (
                  <>
                    <h3>Shipping Address</h3>
                    <input
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={handleAddressChange}
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                    />
                    <button onClick={handleSaveNewAddress}>Save Address</button>
                    <button onClick={() => setIsEditingAddress(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h3>Shipping Address</h3>
                    <p>{user?.address?.street || 'No address provided'}</p>
                    <p>{user?.address?.city}</p>
                    <p>{user?.address?.state}, {user?.address?.postalCode}</p>
                    <p>{user?.address?.country}</p>
                    <button onClick={() => setIsEditingAddress(true)}>Change Address</button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="expandable-section">
            <button
              className="expand-button active"
              onClick={() => setIsExpanded(prev => ({ ...prev, payment: !prev.payment }))}
            >
              Payment Method {isExpanded.payment ? '-' : '+'}
            </button>
            {isExpanded.payment && (
              <div className="section-content payment">
                <h3>Select Payment Method</h3>
                <form className="payment-form">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Credit Card
                  </label>
                  {paymentMethod === 'credit-card' && (
                    <>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="card-element"
                        pattern="\d{16}"
                        title="Please enter a 16-digit card number."
                        maxLength="16"
                        minLength="16"
                        required
                      />
                      <input
                        type="date"
                        placeholder="Expiry Date"
                        className="card-element"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="card-element"
                        pattern="\d{3,4}"
                        title="Please enter a 3 or 4-digit CVC."
                        maxLength="4"
                        minLength="3"
                        required
                      />
                    </>
                  )}
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    PayPal
                  </label>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="expandable-section">
            <button
              className="expand-button active"
              onClick={() => setIsExpanded(prev => ({ ...prev, summary: !prev.summary }))}
            >
              Order Summary {isExpanded.summary ? '-' : '+'}
            </button>
            {isExpanded.summary && (
              <div className="section-content summary">
                <h3>Order Summary</h3>
                <div className="order-items">
                  {items.map((item, index) => (
                    <div key={item.product_id || index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>${item.price} x {item.quantity}</p>
                        <button onClick={() => handleDelete(item.product_id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-summary-total">
                  <p>Total Price: ${totalPrice.toFixed(2)}</p>
                </div>
                <button
                  className="place-order-button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
                {isProcessing && ('Processing...')}
              </div>
            )}
          </div>
        </div>
      )}
      <div>
        {success && !isProcessing && (
          <div className="status-message">
            <h2>{orderPlaced ? "Order Pending Approval" : "Processing Order"}</h2>
            <p>{orderPlaced ? "Your order is pending approval by the admin." : "Your order is being processed."}</p>
          </div>
        )}
      </div>

      <div>
        {success && orderPlaced && invoice && (
          <div className="invoice">
            <h2>Invoice</h2>
            <p>Order Time: {invoice.orderTime}</p>
            <p>Delivery Date: {invoice.deliveryDate}</p>
            <h3>Items</h3>
            <ul>
              {invoice.items.map((item, index) => (
                <li key={index}>
                  {item.name} - ₹{item.price} x {item.quantity} = ₹{item.subtotal.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Total: ₹{invoice.total.toFixed(2)}</p>
            <button onClick={handleGoToCart}>Go to Cart</button>
          </div>
        )}
      </div>

    </div>
  );
}

export default PaymentPage;

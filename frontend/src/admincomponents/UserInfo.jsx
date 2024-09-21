import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserInfo.css'; // Import CSS for user details styling

function UserInfo() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const serverURL = 'http://localhost:5550';

  useEffect(() => {
    handleFetchUser();
  }, [userId]);

  const handleFetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverURL}/api/users/${userId}`);
      setUser(response.data);
      filterPendingOrders(response.data.orders); // Filter pending orders after fetching user
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user", error);
      setError("Failed to fetch user details. Please try again later.");
      setLoading(false);
    }
  };

  // Function to filter and extract pending orders from user orders
  const filterPendingOrders = (orders) => {
    const pendingOrders = orders.filter(order => order.status === 'pending');
    setPendingOrders(pendingOrders);
  };

  const approveOrder = async (orderId) => {
    try {
      await axios.post(`${serverURL}/api/admin/${userId}/approveorders/${orderId}`);
      // Update UI after approval
      handleFetchUser(); // Refresh user data to get updated orders
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-info-container">
      <div className="user-info-card">
        <h1>{user.name}</h1>
        <div className="user-info-grid">
          <div><strong>User ID:</strong> {user._id}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Status:</strong> {user.banned ? "Banned" : "Active"}</div>
          <div><strong>Orders:</strong> {user.orders.length}</div>

          {/* Display pending orders */}
          <div>
            <strong>Pending Orders:</strong>
            {pendingOrders.length > 0 ? (
              <ul>
                {pendingOrders.map(order => (
                  <li key={order._id}>
                    <div>
                      <strong>Order ID:</strong> {order._id}
                    </div>
                    <div>
                      <strong>Order Details:</strong>
                      {order.items.map(item => (
                        <div key={item._id}>
                          {item.name} - {item.quantity} x {item.price}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => approveOrder(order._id)}>Approve Order</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending orders</p>
            )}
          </div>

          {/* Add more user details as necessary */}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

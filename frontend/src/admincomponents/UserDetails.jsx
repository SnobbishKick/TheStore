import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../Mycontext';
import './UserDetail.css';

function UserDetail() {
  const { serverURL, registeredUsers, setRegisteredUsers } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    FetchRegisteredUsers();
  }, []);

  const FetchRegisteredUsers = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/users/getuser`);
      setRegisteredUsers(response.data.userData);
    } catch (error) {
      console.error("Error fetching users", error);
      setError("Failed to fetch users. Please try again later.");
    }
  };

  const banUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${serverURL}/api/users/${id}/ban`);
      FetchRegisteredUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      setError('Failed to ban user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const unbanUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${serverURL}/api/users/${id}/unban`);
      FetchRegisteredUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
      setError('Failed to unban user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${serverURL}/api/users/${id}`);
      FetchRegisteredUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
    }
  };

  return (
    <div className="user-detail-container">
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}
      <div className="user-grid">
        {registeredUsers.length > 0 ? (
          registeredUsers.map((user) => (
            <div className="user-card" key={user._id}>
              <Link to={`/users/${user._id}`}>
                <div><b>ID:</b> {user._id}</div>
                <div><b>Name:</b> {user.name}</div>
                <div><b>Email:</b> {user.email}</div>
              </Link>
              <div className="user-controls">
                {user.banned ? (
                  <button
                    className="unban-btn"
                    onClick={() => unbanUser(user._id)}
                    disabled={loading}
                  >
                    {loading ? 'Unbanning...' : 'Unban User'}
                  </button>
                ) : (
                  <button
                    className="ban-btn"
                    onClick={() => banUser(user._id)}
                    disabled={loading}
                  >
                    {loading ? 'Banning...' : 'Ban User'}
                  </button>
                )}
                {/* Optional delete button */}
                {/* <button onClick={() => deleteUser(user._id)}>Delete</button> */}
              </div>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default UserDetail;

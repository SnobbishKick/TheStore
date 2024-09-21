import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const serverURL = 'http://localhost:5550'; 

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        axios.post(`${serverURL}/api/users/forgotpassword`, { email })
            .then(res => {
                setLoading(false);
                if (res.data.success) {
                    setMessage('Password reset link sent successfully. Please check your email.');
                    setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
                } else {
                    setError(res.data.error || 'Something went wrong');
                }
            })
            .catch(err => {
                setLoading(false);
                setError('An error occurred. Please try again later.');
                console.error(err);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-success w-100 rounded-0"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Submit'}
                    </button>
                    {message && <div className="alert alert-success mt-3">{message}</div>}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;

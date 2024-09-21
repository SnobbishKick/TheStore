import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../Mycontext.jsx';
import "./MyAccount.css";
import axios from 'axios';

const MyAccount = () => {
    const { serverURL, userId } = useContext(MyContext);
    
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/users/${userId}`);
                setUser(response.data);
                setForm({
                    ...response.data,
                    address: response.data.address || {}
                });
            } catch (error) {
                console.error('Error fetching user details', error);
            }
        };

        fetchUserDetails();
    }, [serverURL, userId]);

    const validateForm = () => {
        const errors = {};
    
        if (!form.name.trim()) errors.name = "Name is required";
        if (!form.email.trim()) errors.email = "Email is required";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) errors.email = "Invalid email address";
        if (form.password && form.password.length < 6) errors.password = "Password must be at least 6 characters long";
        if (!form.address.street.trim()) errors.street = "Street address is required";
        if (!form.address.city.trim()) errors.city = "City is required";
        if (!form.address.state.trim()) errors.state = "State is required";
        if (!form.address.postalCode.trim()) errors.postalCode = "Postal code is required";
        if (!form.address.country.trim()) errors.country = "Country is required";
    
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            address: {
                ...prevForm.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!user) return alert('User not found');
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        try {
            const response = await axios.put(`${serverURL}/api/users/updatemyprofile/${user._id}`, form);
            setUser(response.data);
            alert('User details updated successfully');
        } catch (error) {
            console.error('Error updating user details', error);
            alert('Failed to update user details');
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="my-account-container">
            <h1>My Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} />
                    {/* {errors.username && <p className="error">{errors.username}</p>} */}
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <h3>Address</h3>
                <div>
                    <label>Street:</label>
                    <input type="text" name="street" value={form.address.street} onChange={handleAddressChange} />
                    {errors.street && <p className="error">{errors.street}</p>}
                </div>
                <div>
                    <label>City:</label>
                    <input type="text" name="city" value={form.address.city} onChange={handleAddressChange} />
                    {errors.city && <p className="error">{errors.city}</p>}
                </div>
                <div>
                    <label>State:</label>
                    <input type="text" name="state" value={form.address.state} onChange={handleAddressChange} />
                    {errors.state && <p className="error">{errors.state}</p>}
                </div>
                <div>
                    <label>Postal Code:</label>
                    <input type="text" name="postalCode" value={form.address.postalCode} onChange={handleAddressChange} />
                    {errors.postalCode && <p className="error">{errors.postalCode}</p>}
                </div>
                <div>
                    <label>Country:</label>
                    <input type="text" name="country" value={form.address.country} onChange={handleAddressChange} />
                    {errors.country && <p className="error">{errors.country}</p>}
                </div>
                <button type="submit">Update Details</button>
            </form>
        </div>
    );
};

export default MyAccount;

import React, { useState, useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './UserLogin.css';
import { MyContext } from '../Mycontext';
import axios from 'axios';

function UserLogin() {
    const {
        validateEmail,
        validatePassword,
        serverURL,
        setIsLoggedIn,
        setLoggedUser,
        setLoginStatus,
        setEmailError,
        emailError,
        setPasswordError,
        passwordError
    } = useContext(MyContext);

    const [lEmail, setLEmail] = useState('');
    const [lPassword, setLPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const nav = useNavigate();

    const userLoginbtn = async (e) => {
        e.preventDefault();
    
        if (!validateEmail(lEmail)) {
            setEmailError('Please enter a valid email address.');
            alert('Please enter a valid email address.');
            return;
        } else {
            setEmailError('');
        }
    
        if (!validatePassword(lPassword)) {
            setPasswordError('Password must be at least 6 characters long.');
            alert('Password must be at least 6 characters long.');
            return;
        }
    
        try {
            const response = await axios.post(`${serverURL}/api/users/loginuser`, { email: lEmail, password: lPassword });
            setIsLoggedIn(response.data.user);
            setLoggedUser(response.data.user);
            localStorage.setItem('userToken', response.data.authToken);
            localStorage.setItem('userEmail', lEmail);
            localStorage.setItem('userId', response.data.userId);
            alert('Login Successful!');
            nav('/Userhome');
            // nav('/Newuserhome')
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert('Login unsuccessful, you have been banned by admin.');
            } else if (error.response && error.response.status === 400) {
                alert('Incorrect email or password.');
            } else if (error.response && error.response.status === 404) {
                alert('User not found.');
            } else {
                alert('Error logging in. Please try again later.');
            }
            console.error('Error logging in', error);
        }
    };
    

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div style={{ paddingBottom: '305px', backgroundColor: 'deepskyblue' }}>
            <form className="form" style={{ paddingTop: '130px' }} onSubmit={userLoginbtn}>
                <div style={{
                    backgroundColor: '#fffdfc',
                    listStyle: 'none',
                    display: 'grid',
                    width: '400px',
                    height: '350px',
                    marginLeft: '500px',
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    borderRadius: '8px'
                }}>
                    <h1 className='loghed'>Login</h1>
                    <div style={{ paddingLeft: '10px' }}>
                        <label htmlFor="email">Email address*</label>
                        <input
                            type="email"
                            className='inputlog'

                            id="email"
                            placeholder="user email"
                            value={lEmail}
                            onChange={(e) => setLEmail(e.target.value)}
                        />
                    </div>
                    <div style={{ paddingLeft: '10px' }}>
                        <label htmlFor="password">Password*</label>
                        <div className="password-container">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                className='inputlog'
                                placeholder="password"
                                value={lPassword}
                                onChange={(e) => setLPassword(e.target.value)}
                            />
                            <span
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? '👁️' : '👁️‍🗨️'}
                            </span>
                        </div>
                    </div>
                    <button type="submit" style={{backgroundColor:"#018BFF"}}>Login</button>
                    <div>
                        <p style={{ marginLeft: '20px' }}>
                            Don't have an Account?
                            <br />

                            <Link to="forgotpassword" >Forgot password</Link>
                        </p>
                        <span className='createlink' onClick={() => nav('/UserRegister')} style={{ marginLeft: '20px' }}>Register here</span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UserLogin;

import React, { useState, useContext, useEffect } from 'react'
import { MyContext } from '../Mycontext.jsx';
import { useNavigate } from 'react-router-dom';
import "./UserRegister.css";
import axios from 'axios';

function UserRegister() {

    const { validateEmail, validatePassword, serverURL, isUserAlreadyRegistered, registeredUsers, setRegisteredUsers,
        emailError, setEmailError, passwordError, setPasswordError, getUserByEmail, isBannedUser } = useContext(MyContext)

    const nav = useNavigate();

    const [uName, setUName] = useState('');
    const [uEmail, setUEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    // const [emailError, setEmailError] = useState("");
    // const [passwordError, setPasswordError] = useState("");

    // const serverURL = 'http://localhost:5500'


    // const validateEmail = (email) => {
    //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //     return emailRegex.test(email);
    // };

    // const validatePassword = (password) => {
    //     return password.length >= 6;
    // };

    // const isUserAlreadyRegistered = () => {
    //     if (409) {

    //     }
    //     // return registeredUsers.find((userData) => userData.email === uEmail && userData.username === uName)
    // };



    const toLoginbtn = () => {
        nav('/')
    }

    const register = async (event) => {

        // const user = getUserByEmailId()
        // const bannedbyadmin = isBannedUser()

        event.preventDefault();

        if (!validateEmail(uEmail)) {
            setEmailError("Please enter a valid email address.");
            console.log("email", uEmail)
            alert("Please enter a valid email address.")
            return;
        } else {
            setEmailError("");
        }

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 6 characters long.");
            alert("Password must be at least 6 characters long.")
            return;
        } else {
            setPasswordError("");
        }


        if (getUserByEmail()) {
            alert("User Already Registered");
            return;
        }
        if (cPassword !== password) {
            alert("passwords must be same...")
        }

        else {

            try {



                // handleUpload()
                const response = await axios.post(`${serverURL}/api/users/createuser`, {

                    name: uName,
                    email: uEmail,
                    username: userName,
                    password: password,

                },
                );
                // fetchproducts();
                console.log(response.data)
                setUName('')
                setUEmail('');
                setUserName("");
                setPassword("");
                // fetchUsers();

                alert("User Registration successfull!!")
                nav("/")

            } catch (error) {

                // if (error.response && error.response.status === 409) {
                alert("User Email is already registered.");
                //     console.error("User Email is already registered.", error);
                // } else {
                //     alert("Error registering user. Please try again later.");
                console.error("Error registering user", error);
                // }
            }
        }
    };


    // const register = () =>{

    // }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div style={{ paddingBottom: "29px", backgroundColor: "deepskyblue" }}>

            <div>
                {/* <div> */}
                <form style={{ paddingTop: "100px", }} onSubmit={register}>

                    <div style={{
                        backgroundColor: "#fffdfc",
                        listStyle: "none",
                        display: "grid",
                        width: "420px",
                        height: "600px",
                        marginLeft: "500px",
                        // paddingLeft: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"

                    }}>
                        <h1 className='reghed'>Register</h1>
                        <div style={{ paddingLeft: "10px", }}>
                            <label htmlFor="exampleInputEmail1">name*</label>
                            <input type='text'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                placeholder='name'
                                value={uName}
                                onChange={e => setUName(e.target.value)}
                            />
                        </div>
                        <div style={{ paddingLeft: "10px", }}>
                            <label htmlFor="exampleInputEmail1">Email address*</label>
                            <input type="text"
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                placeholder='user email'
                                value={uEmail}
                                onChange={(e) => { setUEmail(e.target.value) }}
                            />
                        </div>
                        <div style={{ paddingLeft: "10px", }}>
                            <label htmlFor="exampleInputEmail1">username*</label>
                            <input type='text'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                placeholder='username'
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }}
                            />
                        </div>
                        <div style={{ paddingLeft: "10px", }}>
                            <label htmlFor="exampleInputEmail1">password*</label>
                            <input type="text" placeholder='password'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </div>
                        <div style={{ paddingLeft: "10px", }}>
                            <label htmlFor="exampleInputEmail1">confirm password*</label>
                            <input type="text" placeholder='confirm password'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                value={cPassword}
                                onChange={(e) => { setCPassword(e.target.value) }}
                            />
                            <span
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? '👁️' : '👁️‍🗨️'}
                            </span>
                        </div>
                        <button className='register-button' type='submit'
                            style={{
                                listStyle: "none", width: "300px", height: "30px",
                                backgroundColor: "#007bff",
                                // borderLeft:"30px" ,
                                // alignContent:"center",
                                marginLeft: "45px"
                            }}
                        >
                            Register
                        </button>
                        <div>
                            <span style={{ marginLeft: "30px" }}>Already have an Account ?</span>
                            <span className='createlink' onClick={() => toLoginbtn()} style={{ marginLeft: "20px" }}>Login here</span>
                        </div>
                    </div>
                </form>
                {/* </div> */}

            </div>
        </div>
    )
}

export default UserRegister
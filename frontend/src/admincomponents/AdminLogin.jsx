import React, { useState, useEffect, useContext} from 'react'
import { Link, useNavigate } from "react-router-dom";
import './AdminLogin.css';
import { MyContext } from '../Mycontext';
import axios from 'axios';

function AdminLogin() {

    const {serverURL} =useContext(MyContext)
    // const [lEmail, setLEmail] = useState('');
    // const [lUserName, setLUserName] = useState('');
    // const [lPassword, setLPassword] = useState('');
    // const [cPassword,setCPassword] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [logSuccess, setLogSuccess] = useState(false);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    // const adminLoginbtn = () => {
    //   if (username === (("admin@gmail.com")||("admin")) && password === "iamadmin") {
    //     alert("Admin Login Successfull");
    //     navigate("/AdminPage");
    //   } else {
    //     alert("Incorrect username or password");
    //     console.log("Incorrect username or password");
    //   }
    // };

    const adminLoginbtn = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${serverURL}/api/admin/login`, { email, password });
            setToken(response.data.token);
            setError('');
            alert('Admin Login Successful');
            setLogSuccess(true)
            console.log("response.data.admintoken",response.data.adminToken);
            localStorage.setItem('AdminToken', response.data.adminToken);
            navigate("/AdminPage");
            // Redirect or perform other actions upon successful login
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };
    
    
    return (
        <div className='adminlogin'>
            <h1 style={{marginLeft:"300px"}}>AdminLogin</h1>
            <div>
                <p>

                    {/* <div> */}
                    <form className="adminloginform" onSubmit={adminLoginbtn}>
                        <li style={{
                            backgroundColor: "#fffdfc",
                            listStyle: "none",
                            display: "grid",
                            width: "400px",
                            height: "350px",
                            marginLeft: "500px",
                            paddingLeft: "10px",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"

                        }}>
                            <h1 className='adminloghead'>Admin Login</h1>

                            <input type='text'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                placeholder='email'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                            {/* <br /> */}
                            <input type="text" placeholder='password'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <br />
                            {/* <input type="text" placeholder='confirm password'
                                style={{ listStyle: "none", width: "380px", height: "40px" }}
                                value={cPassword}
                                onChange={(e) => { setCPassword(e.target.value) }}
                            />
                            <br /> */}
                            <button type='submit'
                                style={{
                                    listStyle: "none", width: "300px", height: "30px",
                                    backgroundColor: "greenyellow",
                                    // borderLeft:"30px" ,
                                    // alignContent:"center",
                                    marginLeft: "45px"
                                }}
                            >
                                Login
                            </button>
                        
                            {/* <Link className='createlink' to="/UserRegister" style={{marginLeft:"50px"}}>Create an Account !!</Link> */}
                        </li>
                    </form>
                    {/* </div> */}

                </p>
            </div>
        </div>
    )
}

export default AdminLogin
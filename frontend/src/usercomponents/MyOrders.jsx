import React from 'react'
import { useState, useContext, useNavigate, useEffect } from 'react'
import { MyContext } from '../Mycontext';
import axios from 'axios';
import './MyOrders.css';

function MyOrders() {

    const { validateEmail, validatePassword, serverURL, isUserAlreadyRegistered, registeredUsers, setRegisteredUsers,
        emailError, setEmailError, passwordError, setPasswordError, getUserByEmail, isBannedUser, storedUserEmail, userId } = useContext(MyContext)

    const [myOrders, setMyOrders] = useState([])
    const [delivery, setDelivery] = useState([])

    useEffect(() => {
        // Fetch user details on component mount
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${serverURL}/api/users/${userId}`);
                //   setMyOrders(response.data.orders.map(item=>item.items.map(data=>data.price)));
                setMyOrders(response.data.orders);
                setDelivery(response.data.orders.map(order => order.items.map(data => data)).flat() || []);
        console.log("response @MyOrder", response.data.orders || [])
        // console.log("response @delivery", response.data.orders.map(order => order.items.map(data => data)).flat() || [])
                console.log("response @delivery", response.data.orders.map(order => order.items.map(data => data)).flat() || [])


            } catch (error) {
                console.error('Error fetching user details', error);
            }
        };

        fetchUserDetails();
    }, [serverURL, userId]);

    console.log("order", myOrders);
    console.log("delivery", delivery);

    const handleDelete = (productId) => {
        setMyOrders(myOrders.filter(item => item.product_id !== productId));
      };

    return (
        <div className='main-div-order'>
            <h1>MyOrders</h1>
            <div>
                {Array.isArray(myOrders) && Array.isArray(delivery) && myOrders.length > 0 ? (
                    <div className='thediv'>
                        <div className='leftdiv'>
                            {delivery.map((dtl, index) => (
                                    <div key={index}>
                                        <img style={{width:"140px",height:"150px"}} src={dtl.image}></img>
                                        <p>{dtl.name}</p>
                                        {/* <p>{detail.orderTime}</p> */}
                                        {/* <p>{detail.deliveryDate}</p> */}
                                    </div>
                                  ))  }
                        </div>
                        
                        <div className='rightdiv'>
                            {myOrders.map((detail, index) => (
                                <div key={index} style={{width:"150",height:"238px"}}>
                                    {/* <p>{detail.items.name}</p> */}
                                    <p>Order Time{detail.orderTime}</p>
                                    <p>Delivery Date{detail.deliveryDate}</p>
                                    {/* <button onClick={() => handleDelete(detail.product_id)}>Delete</button> */}
                                </div>
                            ))}
                        </div>
                        
                    </div>
                ) : (
                    <p>No orders available</p>
                )
                }
            </div >

        </div >
    )
}

export default MyOrders
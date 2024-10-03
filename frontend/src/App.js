import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import AddProducts from './admincomponents/AddProducts';
import UserHome from './usercomponents/UserHome';
import HeaderNavbar from './HeaderNavbar';
import AdminPage from './admincomponents/AdminPage';
import UserLogin from './usercomponents/UserLogin';
import AdminLogin from './admincomponents/AdminLogin';
import UserRegister from './usercomponents/UserRegister';
import UserDetail from './admincomponents/UserDetails';
import { MyContext } from './Mycontext';
import Cart from './usercomponents/Cart';
import Wishlist from './usercomponents/Wishlist';
import Cartcomp from './usercomponents/Cartcomp';
import MyAccount from './usercomponents/MyAccount';
import PaymentPage from './usercomponents/PaymentPage';
import MyOrders from './usercomponents/MyOrders';
import ProductDetails from './usercomponents/ProductDetails';

import Newuserhome from './usercomponents/Newuserhome';
import SortPanel from './usercomponents/SortPanel';
import Dummyuserhome from './usercomponents/Dummyuserhome';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './Footer';
import ForgotPassword from "./usercomponents/ForgotPassword";
import ResetPassword from './usercomponents/ResetPassword';
import MockRegister from './usercomponents/MockRegister';
import UserInfo from './admincomponents/UserInfo';

function App() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [bannedUser, setBannedUser] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addToCart, setAddToCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    priceRange: [0, 10000],
    brand: '',
    type: '',
    gender: '',
  });  const [sortOption, setSortOption] = useState(''); // Default sort option

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const storedUserEmail = localStorage.getItem("userEmail");
  const userToken = localStorage.getItem("userToken");
  const AdminToken = localStorage.getItem("AdminToken");

  const userId = localStorage.getItem("userId")

  const serverURL = 'http://localhost:5550';

  useEffect(() => {
    fetchproducts();
  }, []);

  const fetchproducts = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/products/getproduct`, { withCredentials: true });
      const productData = response.data.productData;
      setProducts(productData);
      setOriginalProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const validateEmail = (email) => {
    if (!email.endsWith("@gmail.com")) {
      setEmailError("Email must be a valid Gmail address");
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const isUserAlreadyRegistered = () => {
    // Implementation needed if you are using this function
  };

  const getUserByEmail = (email) => {
    return registeredUsers.find((user) => user.email === email);
  };

  const removeFromWishList = (itemId) => {
    const updatedWishlistItems = wishlistItems.filter((item) => item.id !== itemId);
    setWishlistItems(updatedWishlistItems);
  };


  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${serverURL}/api/admin/getcategories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    fetchCategories();
}, [serverURL]);


  const value = {
    validateEmail,
    validatePassword,
    serverURL,
    fetchproducts,
    getUserByEmail,
    storedUserEmail,
    userToken,
    AdminToken,
    userId,
    searchInput,
    setSearchInput,
    products,
    setProducts,
    originalProducts,
    setOriginalProducts,
    totalAmount,
    setTotalAmount,
    bannedUser,
    setBannedUser,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    registeredUsers,
    setRegisteredUsers,
    loggedUser,
    setLoggedUser,
    isLoggedIn,
    setIsLoggedIn,
    cartItems,
    setCartItems,
    removeFromWishList,
    wishlistItems,
    setWishlistItems,
    loginStatus,
    setLoginStatus,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    selectedCategory, 
    setSelectedCategory,

  };

  return (
    <div className="App">
      <BrowserRouter>
        <MyContext.Provider value={value}>
          <HeaderNavbar />
          <Routes>
            <Route path='/AddProducts' element={<AddProducts />} />
            <Route path='/UserHome' element={<UserHome />} />
            <Route path='/AdminPage' element={<AdminPage />} />
            <Route path='/UserRegister' element={<UserRegister />} />
            <Route path='/UserDetail' element={<UserDetail />} />
            <Route path='/AdminLogin' element={<AdminLogin />} />
            <Route path='/' element={<UserLogin />} />

            <Route path='/forgotpassword' element={<ForgotPassword/>} />
            <Route path="/resetpassword/:id/:token" element={<ResetPassword />}/>
            <Route path='/mock' element={<MockRegister/>}/>


            <Route path='/Wishlist' element={<Wishlist />} />
            <Route path='/Cart' element={<Cart cartItems={cartItems} />} />
            <Route path='/Cartcomp' element={<Cartcomp />} />
            <Route path='/MyAccount' element={<MyAccount />} />
            <Route path='/PaymentPage' element={<PaymentPage />}/>
            <Route path='/MyOrders' element = {<MyOrders />}/>
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/users/:userId" element={<UserInfo />} />

            <Route path="/Newuserhome" element={<Newuserhome/>} />
            <Route path="/SortPanel" element ={<SortPanel/>} />
            <Route path="/Dummyuserhome" element={<Dummyuserhome/>} />
            {/* <Route path="/Newuserhome" element={<Newuserhome/>} /> */}


          </Routes>
        </MyContext.Provider>
        <Footer />

      </BrowserRouter>
    </div>
  );
}

export default App;

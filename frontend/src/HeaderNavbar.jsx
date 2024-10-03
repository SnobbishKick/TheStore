//the code starts at  line 486......................................................._.

// import React, { useContext, useEffect, useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { BsMinecart } from 'react-icons/bs';
// import { GiSelfLove } from 'react-icons/gi';
// import { AiOutlineUser, AiOutlineFilter, AiOutlineMenu } from 'react-icons/ai';
// import { IoMdLogOut } from 'react-icons/io';
// import { GrUserAdmin } from 'react-icons/gr';
// import Badge from 'react-bootstrap/Badge';
// import { MyContext } from './Mycontext';
// import '../src/HeaderNavbar.css';

// function HeaderNavbar() {
//   const { setLoginStatus, setProducts, userToken, searchInput, setSearchInput, originalProducts, selectedCategory, setSelectedCategory } = useContext(MyContext);
//   const nav = useNavigate();
//   const location = useLocation();
//   const [filters, setFilters] = useState({
//     category: '',
//     subCategory: '',
//     priceRange: [0, 1000000],
//     brand: '',
//     type: '',
//     gender: '',
//   });
//   const [sortOption, setSortOption] = useState("");
//   const [filterVisible, setFilterVisible] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleLogout = () => {
//     alert('User Logging out');
//     localStorage.clear();
//     setLoginStatus('logout');
//     nav('/');
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value;
//     setSearchInput(query);

//     const filteredProducts = applyFilters(originalProducts);
//     const sortedProducts = sortProducts(filteredProducts);
//     const finalProducts = applySearchFilter(sortedProducts, query);
//     setProducts(finalProducts);
//   };
//   useEffect(() => {
//     const filteredProducts = applyFilters(originalProducts);
//     const sortedProducts = sortProducts(filteredProducts);
//     const finalProducts = applySearchFilter(sortedProducts, searchInput);
//     setProducts(finalProducts);
//   }, [searchInput, filters, sortOption, originalProducts]);

//   const applySearchFilter = (products, query) => {
//     if (query.trim() !== "") {
//       return products.filter(item => {
//         const { brand = "", name = "", category = "", subCategory = "", type = "", gender = "" } = item;

//         return (
//           brand.toUpperCase().includes(query.toUpperCase()) ||
//           name.toUpperCase().includes(query.toUpperCase()) ||
//           category.toUpperCase().includes(query.toUpperCase()) ||
//           subCategory.toUpperCase().includes(query.toUpperCase()) ||
//           type.toUpperCase().includes(query.toUpperCase()) ||
//           (gender ? gender.toUpperCase().includes(query.toUpperCase()) : false)
//         );
//       });
//     }
//     return products;
//   };


//   const applyFilters = (products) => {
//     return products.filter(item => {
//       const { brand = "", price = 0, category = "", subCategory = "", gender = "" } = item;

//       // Filtering based on selectedCategory
//       if (selectedCategory && category !== selectedCategory) {
//         return false;
//       }

//       return (
//         (!filters.category || category === filters.category) &&
//         (!filters.subCategory || subCategory === filters.subCategory) &&
//         (price >= filters.priceRange[0] && price <= filters.priceRange[1]) &&
//         (!filters.brand || brand.toUpperCase() === filters.brand.toUpperCase()) &&
//         (!filters.gender || gender.toUpperCase() === filters.gender.toUpperCase())
//       );
//     });
//   };

//   const sortProducts = (products) => {
//     if (sortOption === 'price-asc') {
//       return [...products].sort((a, b) => a.price - b.price);
//     } else if (sortOption === 'price-desc') {
//       return [...products].sort((a, b) => b.price - a.price);
//     } else if (sortOption === 'name-asc') {
//       return [...products].sort((a, b) => a.name.localeCompare(b.name));
//     } else if (sortOption === 'name-desc') {
//       return [...products].sort((a, b) => b.name.localeCompare(a.name));
//     }
//     return products;
//   };

//   const applyFilter = () => {
//     let filteredProducts = applyFilters(originalProducts);
//     filteredProducts = sortProducts(filteredProducts);
//     setProducts(filteredProducts);
//   };

//   const resetFilters = () => {
//     setFilters({
//       category: '',
//       subCategory: '',
//       priceRange: [0, 10000],
//       brand: '',
//       gender: '',
//     });
//     setSortOption('');
//     setSearchInput('');
//     setProducts(originalProducts);
//   };

//   const handleFilterChange = (filterType, value) => {
//     if (filterType === 'minPrice') {
//       const newRange = [Number(value), Math.max(Number(value), filters.priceRange[1])];
//       setFilters(prev => ({
//         ...prev,
//         priceRange: newRange
//       }));
//     } else if (filterType === 'maxPrice') {
//       const newRange = [Math.min(Number(value), filters.priceRange[0]), Number(value)];
//       setFilters(prev => ({
//         ...prev,
//         priceRange: newRange
//       }));
//     } else {
//       setFilters(prev => ({
//         ...prev,
//         [filterType]: value
//       }));
//     }
//   };



//   // function resetFilters() {
//   //   setFilters({
//   //     category: '',
//   //     subCategory: '',
//   //     priceRange: [0, 10000],
//   //     brand: '',
//   //     type: '',
//   //     gender: '',
//   //   });
//   //   setSortOption('');
//   //   setSearchInput('');
//   //   setProducts(originalProducts);
//   // }

//   const toggleFilterVisibility = () => {
//     setFilterVisible(prev => !prev);
//   };

//   const toggleMenu = () => setIsMenuOpen(prev => !prev);

//   const isOnLoginOrRegisterPage = location.pathname === '/' || location.pathname === '/UserRegister';
//   const isOnAdminPage = location.pathname === '/AdminPage';


//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//   };

//   return (
//     <div className='Header-Navbar'>
//       <div className='Nav-bar'>
//         <div className='left-section'>
//           <span className='logo' onClick={() => nav('/UserHome')}>
//           {/* <span className='logo' onClick={() => nav('/NewuserHome')}> */}

//             The Store
//           </span>
//         </div>

//         <div className='center-section'>
//           <input
//             type='text'
//             className='input-Search'
//             placeholder='Search here...'
//             value={searchInput}
//             onChange={handleSearch}
//           />
//           <AiOutlineFilter className='filter-icon' onClick={toggleFilterVisibility} />
//         </div>

//         <div className='right-section'>
//           {/* {!userToken && !isOnLoginOrRegisterPage && ( */}
//           <span className='login-logo' onClick={() => nav('/')}>
//             <AiOutlineUser />
//           </span>
//           {/* )} */}
//           {/* {userToken && !isOnLoginOrRegisterPage && ( */}
//           <>
//             <span className='login-logo' onClick={() => nav('/MyAccount')}>
//               <AiOutlineUser /> MyProfile
//             </span>
//             <span className='login-logo' onClick={handleLogout}>
//               <IoMdLogOut /> Logout
//             </span>
//           </>
//           {/* )} */}
//           <>
//             <Link className='wishlist-logo' to='/Wishlist'>
//               <GiSelfLove />
//             </Link>
//             <span className='cart-logo' onClick={() => userToken ? nav('/Cart') : alert('Please login to view your cart')}>
//               <BsMinecart />
//               <Badge pill bg='secondary' className='cart-badge'></Badge>
//             </span>
//           </>
//           {/* )} */}
//           {/* {!isOnAdminPage && ( */}
//           <Link className='admin-logo' to='/AdminLogin'>
//             <GrUserAdmin />
//           </Link>
//           {/* )} */}
//           <div id="menuToggle">
//             <input type="checkbox" checked={isMenuOpen} onChange={toggleMenu} />
//             <span></span>
//             <span></span>
//             <span></span>

//             <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}>
//               {isOnAdminPage ? (
//                 <>
//                   <button className="menubuttons" onClick={() => nav('/AdminHome')}>AdminHome</button>
//                   <button className="menubuttons" onClick={() => nav('/UserHome')}>User Home</button>
//                   <button className='admin-logo' onClick={() => { handleLogout(); nav('/AdminLogin'); }}>Logout <GrUserAdmin /></button>
//                 </>
//               ) : (
//                 <>
//                   <button className="menubuttons" onClick={() => nav('/MyAccount')}>My Profile</button>
//                   <button className="menubuttons" onClick={() => nav('/MyOrders')}>My Orders</button>
//                   <button className="menubuttons" onClick={() => nav('/UserHome')}>Home</button>
//                   <button className="menubuttons" onClick={() => { handleLogout(); nav('/'); }}>Logout <IoMdLogOut className="logout-icon" /></button>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className={`filter-section ${filterVisible ? 'active' : ''}`}>
//             <label htmlFor='category'>Category:</label>
//             <select
//               id='category'
//               value={filters.category}
//               onChange={(e) => handleFilterChange('category', e.target.value)}
//             >
//               <option value=''>All</option>
//               <option value='Electronics'>Electronics</option>
//               <option value='Clothing'>Clothing</option>
//               <option value='Footwear'>Footwear</option>
//               {/* Add more options as needed */}
//             </select>

//             <label htmlFor='subCategory'>SubCategory:</label>
//             <select
//               id='subCategory'
//               value={filters.subCategory}
//               onChange={(e) => handleFilterChange('subCategory', e.target.value)}
//             >
//               <option value=''>All</option>
//               <option value='Mobile'>Mobile</option>
//               <option value='Dress'>Dress</option>
//               <option value='Jacket'>Jacket</option>
//               <option value='Refrigerator'>Refrigerator</option>
//               <option value='TV'>TV</option>
//               <option value='Headphones'>Headphones</option>
//               <option value='Shirts'>Shirts</option>
//               {/* Add more options as needed */}
//             </select>

//             <label htmlFor='minPrice'>Min Price:</label>
//             <input
//               id='minPrice'
//               type='number'
//               min='0'
//               value={filters.priceRange[0]}
//               onChange={(e) => handleFilterChange('minPrice', e.target.value)}
//             />

//             <label htmlFor='maxPrice'>Max Price:</label>
//             <input
//               id='maxPrice'
//               type='number'
//               min='0'
//               value={filters.priceRange[1]}
//               onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//             />

//             <label htmlFor='brand'>Brand:</label>
//             <input
//               id='brand'
//               type='text'
//               value={filters.brand}
//               onChange={(e) => handleFilterChange('brand', e.target.value)}
//             />

//             <label htmlFor='gender'>Gender:</label>
//             <input
//               id='gender'
//               type='text'
//               value={filters.gender}
//               onChange={(e) => handleFilterChange('gender', e.target.value)}
//             />

//             <label htmlFor='sort'>Sort By:</label>
//             <select
//               id='sort'
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value=''>None</option>
//               <option value='price-asc'>Price: Low to High</option>
//               <option value='price-desc'>Price: High to Low</option>
//               <option value='name-asc'>Name: A to Z</option>
//               <option value='name-desc'>Name: Z to A</option>
//             </select>

//             <button onClick={applyFilter}>Apply Filter</button>
//             <button onClick={resetFilters}>Reset Filters</button>
//           </div>
//         </div>

//       </div>
//       <div className='divbottom'>
//         {/* <button>Mobiles</button>
//         <button>Headphones</button>
//         <button>Shirts</button>
//         <button>Tv</button> */}
//         <span className='catbuttons' onClick={() => handleCategoryChange('Electronics')}>Electronics</span>
//         <span className='catbuttons' onClick={() => handleCategoryChange('Clothing')}>Fashion</span>
//         <span className='catbuttons' onClick={() => handleCategoryChange('Men')}>Men's section</span>
//         <span className='catbuttons' onClick={() => handleCategoryChange('Women')}>Women's Section</span>
//         <span className='catbuttons' onClick={() => handleCategoryChange('Kid')}>Kid's Section</span>

//       </div>
//     </div>
//   );
// }

// export default HeaderNavbar;


// // import React, { useState, useContext } from 'react';
// // import { FaSearch, FaFilter, FaBars, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
// // import { Link } from 'react-router-dom';
// // // import {MyContext} from './MyContext';
// // import { MyContext } from './Mycontext';
// // import '../src/HeaderNavbar.css';


// // function HeaderNavbar() {
// //   const { user, logout, cartItems } = useContext(MyContext);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filters, setFilters] = useState({
// //     category: '',
// //     subCategory: '',
// //     priceRange: [0, 1000],
// //   });
// //   const [isFilterVisible, setIsFilterVisible] = useState(false);
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);

// //   const handleSearchChange = (e) => {
// //     setSearchTerm(e.target.value);
// //   };

// //   const handleFilterChange = (field, value) => {
// //     if (field === 'minPrice' || field === 'maxPrice') {
// //       setFilters((prev) => ({
// //         ...prev,
// //         priceRange: field === 'minPrice' ? [value, prev.priceRange[1]] : [prev.priceRange[0], value],
// //       }));
// //     } else {
// //       setFilters((prev) => ({
// //         ...prev,
// //         [field]: value,
// //       }));
// //     }
// //   };

// //   const applyFilter = () => {
// //     // Add logic to filter products based on filters
// //     console.log('Applying Filters:', filters);
// //     // Example: Call your filter function or API with the filters
// //     setIsFilterVisible(false);
// //   };

// //   const resetFilters = () => {
// //     setFilters({
// //       category: '',
// //       subCategory: '',
// //       priceRange: [0, 1000],
// //     });
// //   };

// //   return (
// //     <div className="Header-Navbar">
// //       <div className="Nav-bar">
// //         <div className="left-section">
// //           <div id="menuToggle">
// //             <input type="checkbox" onChange={() => setIsMenuOpen(!isMenuOpen)} />
// //             <span className="bar"></span>
// //             <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}>
// //               <Link to="/my-account" className="menubuttons">My Account</Link>
// //               <Link to="/wishlist" className="menubuttons"><FaHeart /> Wishlist</Link>
// //               <Link to="/cart" className="menubuttons"><FaShoppingCart /> Cart</Link>
// //               {user ? (
// //                 <button onClick={logout} className="menubuttons">Logout</button>
// //               ) : (
// //                 <Link to="/login" className="menubuttons">Login</Link>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="center-section">
// //           <input
// //             type="text"
// //             className="input-Search"
// //             placeholder="Search for products..."
// //             value={searchTerm}
// //             onChange={handleSearchChange}
// //           />
// //           <button className="filter-icon" onClick={() => setIsFilterVisible(!isFilterVisible)}>
// //             <FaFilter />
// //           </button>
// //           <div className={`filter-section ${isFilterVisible ? 'active' : ''}`}>
// //             <select onChange={(e) => handleFilterChange('category', e.target.value)}>
// //               <option value="">Select Category</option>
// //               <option value="electronics">Electronics</option>
// //               <option value="clothing">Clothing</option>
// //               <option value="shoes">Shoes</option>
// //               {/* Add more options as needed */}
// //             </select>

// //             <label htmlFor='minPrice'>Min Price:</label>
// //             <input
// //               type='number'
// //               id='minPrice'
// //               value={filters.priceRange[0]}
// //               onChange={(e) => handleFilterChange('minPrice', e.target.value)}
// //             />

// //             <label htmlFor='maxPrice'>Max Price:</label>
// //             <input
// //               type='number'
// //               id='maxPrice'
// //               value={filters.priceRange[1]}
// //               onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
// //             />

// //             <button onClick={applyFilter}>Apply Filters</button>
// //             <button onClick={resetFilters}>Reset Filters</button>
// //           </div>
// //         </div>

// //         <div className="right-section">
// //           {user ? (
// //             <span className="login-logo">Welcome, {user.username}!</span>
// //           ) : (
// //             <Link to="/login" className="login-logo">Login</Link>
// //           )}
// //           <Link to="/wishlist" className="wishlist-logo"><FaHeart /></Link>
// //           <Link to="/cart" className="cart-logo">
// //             <FaShoppingCart />
// //             {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default HeaderNavbar;


import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BsMinecart } from 'react-icons/bs';
import { GiSelfLove } from 'react-icons/gi';
import { AiOutlineUser, AiOutlineFilter, AiOutlineMenu } from 'react-icons/ai';
import { IoMdLogOut } from 'react-icons/io';
import { GrUserAdmin } from 'react-icons/gr';
import Badge from 'react-bootstrap/Badge';
import { MyContext } from './Mycontext';
import '../src/HeaderNavbar.css';

function HeaderNavbar() {
  const { setLoginStatus, products, setProducts, userToken, searchInput, setSearchInput, originalProducts, setOriginalProducts, selectedCategory, setSelectedCategory } = useContext(MyContext);
  const nav = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    priceRange: [0, 1000000],
    brand: '',
    type: '',
    gender: '',
  });
  const [sortOption, setSortOption] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    alert('User Logging out');
    localStorage.clear();
    setLoginStatus('logout');
    nav('/');
  };
  const handleLoginbtn = () => {
    nav('/')
  }

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchInput(query);

    // const filteredProducts = applyFilters(originalProducts);
    // const sortedProducts = sortProducts(filteredProducts);
    // const finalProducts = applySearchFilter(sortedProducts, query);
    // setProducts(finalProducts);
  };
  
  useEffect(() => {
    const filteredProducts = applyFilters(originalProducts);
    const sortedProducts = sortProducts(filteredProducts);
    const finalProducts = applySearchFilter(sortedProducts, searchInput);
    setOriginalProducts(finalProducts);
  }, [searchInput, filters, sortOption]);

  const applySearchFilter = (products, query) => {
    if (query.trim() !== "") {
      return products.filter(item => {
        const { brand = "", name = "", category = "", subCategory = "", type = "", gender = "" } = item;

        return (
          brand.toUpperCase().includes(query.toUpperCase()) ||
          name.toUpperCase().includes(query.toUpperCase()) ||
          category.toUpperCase().includes(query.toUpperCase()) ||
          subCategory.toUpperCase().includes(query.toUpperCase()) ||
          type.toUpperCase().includes(query.toUpperCase()) ||
          (gender ? gender.toUpperCase().includes(query.toUpperCase()) : false)
        );
      });
    }
    return products;
  };


  const applyFilters = (products) => {
    return products.filter(item => {
      const { brand = "", price = 0, category = "", subCategory = "", gender = "" } = item;

      // Filtering based on selectedCategory
      if (selectedCategory && category !== selectedCategory) {
        return false;
      }

      return (
        (!filters.category || category === filters.category) &&
        (!filters.subCategory || subCategory === filters.subCategory) &&
        (price >= filters.priceRange[0] && price <= filters.priceRange[1]) &&
        (!filters.brand || brand.toUpperCase() === filters.brand.toUpperCase()) &&
        (!filters.gender || gender.toUpperCase() === filters.gender.toUpperCase())
      );
    });
  };

  const sortProducts = (products) => {
    if (sortOption === 'price-asc') {
      return [...products].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      return [...products].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    }
    return products;
  };

  const applyFilter = () => {
    let filteredProducts = applyFilters(originalProducts);
    filteredProducts = sortProducts(filteredProducts);
    setProducts(filteredProducts);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      priceRange: [0, 1000000],
      brand: '',
      gender: '',
    });
    setSortOption('');
    setSearchInput('');
    setProducts(originalProducts);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'minPrice') {
      const newRange = [Number(value), Math.max(Number(value), filters.priceRange[1])];
      setFilters(prev => ({
        ...prev,
        priceRange: newRange
      }));
    } else if (filterType === 'maxPrice') {
      const newRange = [Math.min(Number(value), filters.priceRange[0]), Number(value)];
      setFilters(prev => ({
        ...prev,
        priceRange: newRange
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };



  // function resetFilters() {
  //   setFilters({
  //     category: '',
  //     subCategory: '',
  //     priceRange: [0, 10000],
  //     brand: '',
  //     type: '',
  //     gender: '',
  //   });
  //   setSortOption('');
  //   setSearchInput('');
  //   setProducts(originalProducts);
  // }

  const toggleFilterVisibility = () => {
    setFilterVisible(prev => !prev);
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const isOnLoginOrRegisterPage = location.pathname === '/' || location.pathname === '/UserRegister';
  const isOnAdminPage = location.pathname === '/AdminPage';


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filteredProducts = applyFilters(originalProducts);
    setOriginalProducts(filteredProducts);
  };

  // const filteredProducts = applyFilters(originalProducts);
  //   const sortedProducts = sortProducts(filteredProducts);
  //   const finalProducts = applySearchFilter(sortedProducts, searchInput);
  //   setProducts(finalProducts);

  return (
    <div className='Header-Navbar'>
      <div className='Nav-bar'>
        <div className='left-section'>
          <span className='logo' onClick={() => nav('/UserHome')}>
            {/* <span className='logo' onClick={() => nav('/NewuserHome')}> */}

            The Store
          </span>
        </div>

        <div className='center-section'>
          <input
            type='text'
            className='input-Search'
            placeholder='Search here...'
            value={searchInput}
            onChange={handleSearch}
          />
          <AiOutlineFilter className='filter-icon' onClick={toggleFilterVisibility} />
        </div>

        <div className='right-section'>
          {/* {!userToken && !isOnLoginOrRegisterPage && ( */}
          <span className='login-logo' onClick={() => nav('/')}>
            <AiOutlineUser />
          </span>
          {/* )} */}
          {/* {userToken && !isOnLoginOrRegisterPage && ( */}
          <>
            <span className='login-logo' onClick={() => nav('/MyAccount')}>
              <AiOutlineUser /> MyProfile
            </span>
            {
              userToken ?
                <button className="menubuttons" onClick={handleLogout}>Logout <IoMdLogOut className="logout-icon" /></button>
                :
                <button className="menubuttons" onClick={handleLoginbtn}>Login </button>
            }
          </>
          {/* )} */}
          <>
            <Link className='wishlist-logo' to='/Wishlist'>
              <GiSelfLove />
            </Link>
            <span className='cart-logo' onClick={() => userToken ? nav('/Cart') : alert('Please login to view your cart')}>
              <BsMinecart />
              <Badge pill bg='secondary' className='cart-badge'></Badge>
            </span>
          </>
          {/* )} */}
          {/* {!isOnAdminPage && ( */}
          <Link className='admin-logo' to='/AdminLogin'>
            <GrUserAdmin />
          </Link>
          {/* )} */}
          <div id="menuToggle">
            <input type="checkbox" checked={isMenuOpen} onChange={toggleMenu} />
            <span></span>
            <span></span>
            <span></span>

            <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}>
              {isOnAdminPage ? (
                <>
                  <button className="menubuttons" onClick={() => nav('/AdminHome')}>AdminHome</button>
                  <button className="menubuttons" onClick={() => nav('/UserHome')}>User Home</button>
                  <button className='admin-logo' onClick={() => { handleLogout(); nav('/AdminLogin'); }}>Logout <GrUserAdmin /></button>
                </>
              ) : (
                <>
                  <button className="menubuttons" onClick={() => nav('/MyAccount')}>My Profile</button>
                  <button className="menubuttons" onClick={() => nav('/MyOrders')}>My Orders</button>
                  <button className="menubuttons" onClick={() => nav('/UserHome')}>Home</button>
                  {
                    userToken ?
                      <button className="menubuttons" onClick={handleLogout}>Logout <IoMdLogOut className="logout-icon" /></button>
                      :

                      <button className="menubuttons" onClick={handleLoginbtn}>Login </button>

                  }
                </>
              )}
            </div>
          </div>

          <div className={`filter-section ${filterVisible ? 'active' : ''}`}>
            <label htmlFor='category'>Category:</label>
            <select
              id='category'
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value=''>All</option>
              <option value='Electronics'>Electronics</option>
              <option value='Clothing'>Clothing</option>
              <option value='Footwear'>Footwear</option>
              {/* Add more options as needed */}
            </select>

            <label htmlFor='subCategory'>SubCategory:</label>
            <select
              id='subCategory'
              value={filters.subCategory}
              onChange={(e) => handleFilterChange('subCategory', e.target.value)}
            >
              <option value=''>All</option>
              <option value='Mobile'>Mobile</option>
              <option value='Dress'>Dress</option>
              <option value='Jacket'>Jacket</option>
              <option value='Refrigerator'>Refrigerator</option>
              <option value='TV'>TV</option>
              <option value='Headphones'>Headphones</option>
              <option value='Shirts'>Shirts</option>
              {/* Add more options as needed */}
            </select>

            <label htmlFor='minPrice'>Min Price:</label>
            <input
              id='minPrice'
              type='number'
              min='0'
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />

            <label htmlFor='maxPrice'>Max Price:</label>
            <input
              id='maxPrice'
              type='number'
              min='0'
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />

            <label htmlFor='brand'>Brand:</label>
            <input
              id='brand'
              type='text'
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />

            <label htmlFor='gender'>Gender:</label>
            <input
              id='gender'
              type='text'
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            />

            <label htmlFor='sort'>Sort By:</label>
            <select
              id='sort'
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value=''>None</option>
              <option value='price-asc'>Price: Low to High</option>
              <option value='price-desc'>Price: High to Low</option>
              <option value='name-asc'>Name: A to Z</option>
              <option value='name-desc'>Name: Z to A</option>
            </select>

            <button onClick={applyFilter}>Apply Filter</button>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

      </div>
      <div className='divbottom'>
        {/* <button>Mobiles</button>
        <button>Headphones</button>
        <button>Shirts</button>
        <button>Tv</button> */}
        <span className='catbuttons' onClick={() => handleCategoryChange('Electronics')}>Electronics</span>
        <span className='catbuttons' onClick={() => handleCategoryChange('Clothing')}>Fashion</span>
        <span className='catbuttons' onClick={() => handleCategoryChange('Men')}>Men's section</span>
        <span className='catbuttons' onClick={() => handleCategoryChange('Women')}>Women's Section</span>
        <span className='catbuttons' onClick={() => handleCategoryChange('Kid')}>Kid's Section</span>

      </div>
    </div>
  );
}

export default HeaderNavbar;


// import React, { useState, useContext } from 'react';
// import { FaSearch, FaFilter, FaBars, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// // import {MyContext} from './MyContext';
// import { MyContext } from './Mycontext';
// import '../src/HeaderNavbar.css';


// function HeaderNavbar() {
//   const { user, logout, cartItems } = useContext(MyContext);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     category: '',
//     subCategory: '',
//     priceRange: [0, 1000],
//   });
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (field, value) => {
//     if (field === 'minPrice' || field === 'maxPrice') {
//       setFilters((prev) => ({
//         ...prev,
//         priceRange: field === 'minPrice' ? [value, prev.priceRange[1]] : [prev.priceRange[0], value],
//       }));
//     } else {
//       setFilters((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   const applyFilter = () => {
//     // Add logic to filter products based on filters
//     console.log('Applying Filters:', filters);
//     // Example: Call your filter function or API with the filters
//     setIsFilterVisible(false);
//   };

//   const resetFilters = () => {
//     setFilters({
//       category: '',
//       subCategory: '',
//       priceRange: [0, 1000],
//     });
//   };

//   return (
//     <div className="Header-Navbar">
//       <div className="Nav-bar">
//         <div className="left-section">
//           <div id="menuToggle">
//             <input type="checkbox" onChange={() => setIsMenuOpen(!isMenuOpen)} />
//             <span className="bar"></span>
//             <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}>
//               <Link to="/my-account" className="menubuttons">My Account</Link>
//               <Link to="/wishlist" className="menubuttons"><FaHeart /> Wishlist</Link>
//               <Link to="/cart" className="menubuttons"><FaShoppingCart /> Cart</Link>
//               {user ? (
//                 <button onClick={logout} className="menubuttons">Logout</button>
//               ) : (
//                 <Link to="/login" className="menubuttons">Login</Link>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="center-section">
//           <input
//             type="text"
//             className="input-Search"
//             placeholder="Search for products..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//           <button className="filter-icon" onClick={() => setIsFilterVisible(!isFilterVisible)}>
//             <FaFilter />
//           </button>
//           <div className={`filter-section ${isFilterVisible ? 'active' : ''}`}>
//             <select onChange={(e) => handleFilterChange('category', e.target.value)}>
//               <option value="">Select Category</option>
//               <option value="electronics">Electronics</option>
//               <option value="clothing">Clothing</option>
//               <option value="shoes">Shoes</option>
//               {/* Add more options as needed */}
//             </select>

//             <label htmlFor='minPrice'>Min Price:</label>
//             <input
//               type='number'
//               id='minPrice'
//               value={filters.priceRange[0]}
//               onChange={(e) => handleFilterChange('minPrice', e.target.value)}
//             />

//             <label htmlFor='maxPrice'>Max Price:</label>
//             <input
//               type='number'
//               id='maxPrice'
//               value={filters.priceRange[1]}
//               onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
//             />

//             <button onClick={applyFilter}>Apply Filters</button>
//             <button onClick={resetFilters}>Reset Filters</button>
//           </div>
//         </div>

//         <div className="right-section">
//           {user ? (
//             <span className="login-logo">Welcome, {user.username}!</span>
//           ) : (
//             <Link to="/login" className="login-logo">Login</Link>
//           )}
//           <Link to="/wishlist" className="wishlist-logo"><FaHeart /></Link>
//           <Link to="/cart" className="cart-logo">
//             <FaShoppingCart />
//             {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HeaderNavbar;



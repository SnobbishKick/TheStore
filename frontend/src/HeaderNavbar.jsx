import React, { useContext, useState } from 'react';
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
  const { setLoginStatus, setProducts,filters, setFilters,sortOption, setSortOption , userToken, searchInput, setSearchInput, originalProducts } = useContext(MyContext);
  const nav = useNavigate();
  const location = useLocation();
  // const [filters, setFilters] = useState({
  //   category: '',
  //   subCategory: '',
  //   priceRange: [0, 10000],
  //   brand: '',
  //   type: '',
  //   gender: '',
  // });
  // const [sortOption, setSortOption] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    alert('User Logging out');
    localStorage.clear();
    setLoginStatus('logout');
    nav('/');
  };

  function handleSearch(e) {
    const query = e.target.value;
    setSearchInput(query);

    let filteredProducts = categoryFilter(originalProducts);

    if (query.trim() !== "") {
      filteredProducts = filteredProducts.filter(item => {
        const { brand = "", name = "", category = "", subCategory = "", type = "", gender = "", attributes = {} } = item;

        return (
          brand.toUpperCase().includes(query.toUpperCase()) ||
          name.toUpperCase().includes(query.toUpperCase()) ||
          category.toUpperCase().includes(query.toUpperCase()) ||
          subCategory.toUpperCase().includes(query.toUpperCase()) ||
          type.toUpperCase().includes(query.toUpperCase()) ||
          (gender ? gender.toUpperCase().includes(query.toUpperCase()) : false) ||
          Object.values(attributes).some(attr => attr.toUpperCase().includes(query.toUpperCase()))
        );
      });
    }

    const sortedProducts = sortProducts(filteredProducts);
    setProducts(sortedProducts);
  }

  function categoryFilter(products) {
    return products.filter(item => {
      const { brand = "", price = 0, category = "", subCategory = "", type = "", gender = "" } = item;
  
      return (
        (!filters.category || category === filters.category) &&
        (!filters.subCategory || subCategory === filters.subCategory) &&
        (price >= filters.priceRange[0] && price <= filters.priceRange[1]) &&
        (!filters.brand || brand === filters.brand) &&
        (!filters.type || type === filters.type) &&
        (!filters.gender || gender === filters.gender)
      );
    });
  }
  
  

  // function applyFilters(products) {
  //   return products.filter(item => {
  //     const { brand = "", price = 0, category = "", subCategory = "", type = "", gender = "" } = item;

  //     return (
  //       (!filters.category || category === filters.category) &&
  //       (!filters.subCategory || subCategory === filters.subCategory) &&
  //       (price >= filters.priceRange[0] && price <= filters.priceRange[1]) &&
  //       (!filters.brand || brand === filters.brand) &&
  //       (!filters.type || type === filters.type) &&
  //       (!filters.gender || gender === filters.gender)
  //     );
  //   });
  // }

  function sortProducts(products) {
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
  }

  function handleFilterChange(filterType, value) {
    if (filterType === 'minPrice') {
      const newRange = [value, Math.max(value, filters.priceRange[1])];
      setFilters(prev => ({
        ...prev,
        priceRange: newRange
      }));
    } else if (filterType === 'maxPrice') {
      const newRange = [Math.min(value, filters.priceRange[0]), value];
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
  }

  function handleSortChange(e) {
    setSortOption(e.target.value);
  }

  function applyFilter() {
    console.log('Filters:', filters);
    console.log('Sort Option:', sortOption);
    const filteredProducts = categoryFilter(originalProducts);
    const sortedProducts = sortProducts(filteredProducts);
    setProducts(sortedProducts);
  }
  
  

  function resetFilters() {
    setFilters({
      category: '',
      subCategory: '',
      priceRange: [0, 10000],
      brand: '',
      type: '',
      gender: '',
    });
    setSortOption('');
    setSearchInput('');
    setProducts(originalProducts);
  }

  const toggleFilterVisibility = () => {
    setFilterVisible(prev => !prev);
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const isOnLoginOrRegisterPage = location.pathname === '/' || location.pathname === '/UserRegister';
  const isOnAdminPage = location.pathname === '/AdminPage';

  return (
    <div className='Header-Navbar'>
      <div className='Nav-bar'>
        <div className='left-section'>
          <span className='logo' onClick={() => nav('/UserHome')}>
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
          {!userToken && !isOnLoginOrRegisterPage && (
            <span className='login-logo' onClick={() => nav('/')}>
              <AiOutlineUser />
            </span>
          )}
          {userToken && !isOnLoginOrRegisterPage && (
            <>
              <span className='login-logo' onClick={() => nav('/MyAccount')}>
                <AiOutlineUser /> MyProfile
              </span>
              <span className='login-logo' onClick={handleLogout}>
                <IoMdLogOut /> Logout
              </span>
            </>
          )}
          {!isOnLoginOrRegisterPage && !isOnAdminPage && (
            <>
              <Link className='wishlist-logo' to='/Wishlist'>
                <GiSelfLove />
              </Link>
              <span className='cart-logo' onClick={() => userToken ? nav('/Cart') : alert('Please login to view your cart')}>
                <BsMinecart />
                <Badge pill bg='secondary' className='cart-badge'></Badge>
              </span>
            </>
          )}
          {/* {isOnAdminPage && ( */}
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
                  <button className="menubuttons" onClick={() => { handleLogout(); nav('/'); }}>Logout <IoMdLogOut className="logout-icon" style={{ width: '30px', height: "45px" }} /></button>
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

            {/* <label htmlFor='type'>Type:</label>
            <input
              id='type'
              type='text'
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            /> */}

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
              onChange={handleSortChange}
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
        {/* <div>
        <label htmlFor='category'>Category:</label>
            <select
              id='category'
              value={filters.category}
              onChange={(e) => categoryFilter('category', e.target.value)}
            >
              <option value=''>All</option>
              <option value='Electronics'>Electronics</option>
              <option value='Clothing'>Clothing</option>
              <option value='Footwear'>Footwear</option>
            </select>
        </div> */}
      </div>
    </div>
  );
}

export default HeaderNavbar;

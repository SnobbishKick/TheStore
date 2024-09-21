import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../Mycontext';
import axios from 'axios';
import '../admincomponents/AdminPage.css';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const { serverURL, fetchproducts
        // , products, setProducts
    } = useContext(MyContext);
    const nav = useNavigate()
    const [editProductId, setEditProductId] = useState(null);
    const [selectedEditCategory, setSelectedEditCategory] = useState('');
    const [selectedEditSubCategory, setSelectedEditSubCategory] = useState('');
    const [editProduct, setEditProduct] = useState({
        image: '',
        name: '',
        brand: '',
        price: '',
        category: '',
        subCategory: '',
        type: '',
        gender: '',
        attributes: {},
        description: '',
        inStock: ''
    });
    const [newProduct, setNewProduct] = useState({
        image: '',
        name: '',
        brand: '',
        price: '',
        category: '',
        subCategory: '',
        type: '',
        gender: '',
        description: '',
        inStock: 0,
        attributes: {}
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [types, setTypes] = useState({});
    // const [genders, setGenders] = useState(['Men', 'Women', 'Unisex', 'Kid']);
    const [genders, setGenders] = useState([]);


    const [newCategory, setNewCategory] = useState('');
    const [newSubCategory, setNewSubCategory] = useState('');
    const [newType, setNewType] = useState('');

    const [products, setProducts] = useState([]);
    // const [editProduct, setEditProduct] = useState({});
    // const [editProductId, setEditProductId] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch categories and products on page load
    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchGenders();
        //         setSubCategories((categories.map(cat => cat.subCategories.map(cat => cat.name))));
        // console.log(subCategories)
    }, []);

    // subCategories.map(item=>( 
    //     console.log("item",item)

    //  ))

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${serverURL}/api/admin/getcategories`);
            const { categories, subCategories, types } = res.data;

            // Set categories and subcategories
            setCategories(categories || []);
            setSubCategories(subCategories || {});
            setTypes(types || {});
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchGenders = async () => {
        try {
            const response = await axios.get(`${serverURL}/api/products/genders`);
            setGenders(response.data); // Ensure you're getting the correct response
            console.log('response.data:', response.data);

        } catch (error) {
            console.error('Error fetching genders:', error.response ? error.response.data : error.message);
        }
    };



    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${serverURL}/api/products/getproduct`);
            setProducts(res.data.productData);
            console.log("res.data", res.data)
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    console.log("products", products)

    const handleProductChange = (e, mode) => {
        const { name, value } = e.target;
        if (mode === 'add') {
            setNewProduct((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setEditProduct((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverURL}/api/admin/addcategory`, {
                name: newCategory,
                subCategories: []
            });
            setNewCategory('');  // Clear input after success
            setSuccessMessage('Category added successfully!');
            await fetchCategories();  // Re-fetch categories to update state
        } catch (error) {
            setErrorMessage('Error adding category');
        }
    };



    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverURL}/api/admin/addsubcategory`, {
                categoryId: selectedCategory,  // Pass the categoryId
                name: newSubCategory
            });

            setSubCategories({
                ...subCategories,
                [selectedCategory]: [...(subCategories[selectedCategory] || []), res.data]  // Update subCategories for the selected category
            });

            setNewSubCategory('');
            setSuccessMessage('Subcategory added successfully!');
            await fetchCategories();  // Ensure that the categories are updated after adding a subcategory
        } catch (error) {
            setErrorMessage('Error adding subcategory');
        }
    };


    const handleAddType = async (e) => {
        e.preventDefault();
        try {
            // Post request to add a new type
            const res = await axios.post(`${serverURL}/api/admin/addtypes`, {
                categoryId: selectedCategory,  // Use categoryId instead of category
                subCategoryId: selectedSubCategory,  // Use subCategoryId instead of subCategory
                name: newType
            });

            // Update the types state
            setTypes({
                ...types,
                [selectedSubCategory]: [...(types[selectedSubCategory] || []), res.data]
            });

            // Clear the input field and show success message
            setNewType('');
            setSuccessMessage('Type added successfully!');

            // Refresh categories, subcategories, and types
            await fetchCategories();
        } catch (error) {
            console.error('Error adding type:', error);
            setErrorMessage(`Error adding type: ${error.response?.data?.message || error.message}`);
        }
    };


    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setNewProduct({ ...newProduct, category: categoryId, subCategory: '', type: '' });
        // Load subcategories for the selected category
    };

    const handleSubCategoryChange = (e) => {
        const subCategoryId = e.target.value;
        setSelectedSubCategory(subCategoryId);
        setNewProduct({ ...newProduct, subCategory: subCategoryId, type: '' });
        // Load types for the selected subcategory
    };

    const handleEditCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedEditCategory(categoryId);
        setEditProduct({ ...editProduct, category: categoryId, subCategory: '', type: '' });
    };

    const handleEditSubCategoryChange = (e) => {
        const subCategoryId = e.target.value;
        setSelectedEditSubCategory(subCategoryId);
        setEditProduct({ ...editProduct, subCategory: subCategoryId, type: '' });
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${serverURL}/api/products/addproduct`, newProduct);
            setNewProduct({
                image: '',
                name: '',
                brand: '',
                price: '',
                category: '',
                subCategory: '',
                type: '',
                gender: '',
                description: '',
                inStock: 0,
                attributes: {}
            });
            setSuccessMessage('Product added successfully!');
            fetchProducts(); // refresh the product list
        } catch (error) {
            console.error('Error adding product:', error.response?.data || error.message); // More detailed error log
            setErrorMessage('Error adding product');
        }
    };


    const handleEditProduct = (productId) => {
        const productToEdit = products.find(product => product._id === productId);
        setEditProduct(productToEdit);
        setEditProductId(productId);
    };
    const handleCancelEdit = () => {
        setEditProductId(null);
        setEditProduct({
            image: '',
            name: '',
            brand: '',
            price: '',
            category: '',
            subCategory: '',
            type: '',
            gender: '',
            attributes: {},
            description: '',
            inStock: ''
        });
    };
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${serverURL}/api/products/${editProductId}`, editProduct);
            setEditProductId(null);
            setSuccessMessage('Product updated successfully!');
            fetchProducts(); // refresh the product list
        } catch (error) {
            setErrorMessage('Error updating product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`${serverURL}/api/products/${productId}`);
            setSuccessMessage('Product deleted successfully!');
            fetchProducts(); // refresh the product list
        } catch (error) {
            setErrorMessage('Error deleting product');
        }
    };
    console.log('Edit Product:', editProduct);
    console.log('New Product:', newProduct);
    console.log('Categories:', categories);
    console.log('SubCategories:', subCategories);
    console.log('Types:', types);
    console.log('genders:', genders);
    const UserDetailbtn = () => {
        nav('/userdetail')
    }

    return (
        <div className="admin-page">
            {/* <h1>Admin Page</h1> */}
            <h2>Admin Dashboard</h2>
            <div className="container">

                <button onClick={UserDetailbtn}>UserDetail</button>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* Add New Category Form */}
                <form onSubmit={handleAddCategory}>
                    <h3>Add New Category</h3>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                    />
                    <button type="submit">Add Category</button>
                </form>

            </div>
            <div className="container">
                {/* Add New Subcategory Form */}
                <form onSubmit={handleAddSubCategory}>
                    <h3>Add New Subcategory</h3>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newSubCategory}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                        placeholder="New Subcategory Name"
                    />
                    <button type="submit">Add Subcategory</button>
                </form>
            </div>
            <div className="container">
                {/* Add New Type Form */}
                <form onSubmit={handleAddType}>
                    <h3>Add New Type</h3>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Subcategory Selection */}
                    <select
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                    >
                        <option value="">Select Subcategory</option>
                        {subCategories[selectedCategory]?.map((subCategory) => (
                            <option key={subCategory._id} value={subCategory._id}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>

                    {/* Type Input */}
                    <input
                        type="text"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        placeholder="New Type Name"
                    />
                    <button type="submit">Add Type</button>
                </form>
            </div>
            <div className="container">

                <h2>Add New Product</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmitProduct}>
                    <h3>Add New Product</h3>
                    <input
                        type="text"
                        name="image"
                        value={newProduct.image}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                        placeholder="Image URL"
                    />
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                        placeholder="Product Name"
                    />
                    <input
                        type="text"
                        name="brand"
                        value={newProduct.brand}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                        placeholder="Brand"
                    />
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                        placeholder="Price"
                    />

                    {/* Category Selection */}
                    <select
                        name="category"
                        value={newProduct.category}
                        className="input-field"
                        onChange={(e) => handleCategoryChange(e)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Subcategory Selection */}
                    <select
                        name="subCategory"
                        value={newProduct.subCategory}
                        className="input-field"
                        onChange={(e) => handleSubCategoryChange(e)}
                    >
                        <option value="">Select Subcategory</option>
                        {(subCategories[selectedCategory] || []).map((subCategory, index) => (
                            <option key={index} value={subCategory._id}>
                                {subCategory.name}
                            </option>
                        ))}
                    </select>

                    {/* Type Selection */}
                    <select
                        name="type"
                        value={newProduct.type}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                    >
                        <option value="">Select Type</option>
                        {(types[selectedSubCategory] || []).map((type, index) => (
                            <option key={index} value={type._id}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="gender"
                        value={newProduct.gender}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                    >
                        <option value="">Select Gender</option>
                        {genders.map((gender, index) => (
                            <option key={index} value={gender}>
                                {gender}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                        placeholder="Description"
                    />
                    <input
                        type="number"
                        name="inStock"
                        value={newProduct.inStock}
                        className="input-field"
                        onChange={(e) => handleProductChange(e, 'add')}
                        placeholder="In Stock Quantity"
                    />
                    <button type="submit">Add Product</button>
                </form>


            </div>
            <h2>Product List</h2>
            <div className="container">

                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        {editProductId === product._id ? (
                            <form onSubmit={handleUpdateProduct} className="product-form">
                                <input type='url' name='image' className="input-field" placeholder='Product Image URL' value={editProduct.image} onChange={(e) => handleProductChange(e, 'edit')} />
                                <input type="text" name='name' className="input-field" placeholder='Product Name' value={editProduct.name} onChange={(e) => handleProductChange(e, 'edit')} />
                                <input type='text' name='brand' className="input-field" placeholder='Brand' value={editProduct.brand} onChange={(e) => handleProductChange(e, 'edit')} />
                                <input type='number' name='price' className="input-field" placeholder='Price' value={editProduct.price} onChange={(e) => handleProductChange(e, 'edit')} />
                                {/* <select name='category' className="input-field" value={editProduct.category} onChange={(e) => handleProductChange(e, 'edit')}>
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                <select name='subCategory' className="input-field" value={editProduct.subCategory} onChange={(e) => handleProductChange(e, 'edit')}>
                                    <option value="">Select Subcategory</option>
                                    {(subCategories[editProduct.category] || []).map((subCategory, index) => (
                                        <option key={index} value={subCategory.name}>{subCategory.name}</option>
                                    ))}
                                </select>
                                <select name='type' className="input-field" value={editProduct.type} onChange={(e) => handleProductChange(e, 'edit')}>
                                    <option value="">Select Type</option>
                                    {(types[editProduct.subCategory] || []).map((type, index) => (
                                        <option key={index} value={type.name}>{type.name}</option>
                                    ))}
                                </select> */}
                                <select
                                    name="category"
                                    value={editProduct.category}
                                    className="input-field"
                                    onChange={handleEditCategoryChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Subcategory Selection */}
                                <select
                                    name="subCategory"
                                    value={editProduct.subCategory}
                                    className="input-field"
                                    onChange={handleEditSubCategoryChange}
                                >
                                    <option value="">Select Subcategory</option>
                                    {(subCategories[selectedEditCategory] || []).map((subCategories, index) => (
                                        <option key={index} value={subCategories._id}>
                                         <h1>{subCategories.name}</h1>   
                                        </option>
                                    ))}
                                </select>

                                {/* Type Selection */}
                                <select
                                    name="type"
                                    value={editProduct.type}
                                    className="input-field"
                                    onChange={(e) => handleProductChange(e, 'edit')}
                                >
                                    <option value="">Select Type</option>
                                    {(types[selectedEditSubCategory] || []).map((type, index) => (
                                        <option key={index} value={type._id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <select name='gender' className="input-field" value={editProduct.gender} onChange={(e) => handleProductChange(e, 'edit')}>
                                    <option value="">Select Gender</option>
                                    {genders.map((gender, index) => (
                                        <option key={index} value={gender}>{gender}</option>
                                    ))}
                                </select>
                                {Object.keys([editProduct.category] || {}).map((attribute, index) => (
                                    <input key={index} type='text' name={attribute} className="input-field" placeholder={attribute} value={editProduct.attributes[attribute] || ''} onChange={(e) => handleProductChange(e, 'edit')} />
                                ))}
                                <input type='text' name='description' className="input-field" placeholder='Product Description' value={editProduct.description} onChange={(e) => handleProductChange(e, 'edit')} />
                                <input type='number' name='inStock' className="input-field" placeholder='Stock Quantity' value={editProduct.inStock} onChange={(e) => handleProductChange(e, 'edit')} />
                                <button type='submit' className="submit-button">Update Product</button>
                                <button type='button' onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <img src={product.image} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p>Brand: {product.brand}</p>
                                <p>Price: ${product.price}</p>
                                <p>Category: {product.category}</p>
                                <p>Subcategory: {product.subCategory}</p>
                                <p>Type: {product.type}</p>
                                <p>Gender: {product.gender}</p>
                                <p>Description: {product.description}</p>
                                <p>In Stock: {product.inStock}</p>
                                <button onClick={() => handleEditProduct(product._id)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
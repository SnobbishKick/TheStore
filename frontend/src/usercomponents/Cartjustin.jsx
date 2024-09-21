
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";


function AddProduct() {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductImage, setEditProductImage] = useState("");

  const serverURL = "http://localhost:4000";

  const navigate = useNavigate()

  function handleUserDetail() {
    navigate("/UserAdmin")
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/product/getproduct`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${serverURL}/api/product/addproduct`, {
        name: newProductName,
        image: newProductImage,
        price: newProductPrice,
        category: newProductCategory,
      });
      alert("Your Product is added successfully");
      setNewProductName("");
      setNewProductPrice("");
      setNewProductCategory("");
      setNewProductImage("");
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const updateProduct = async (event, id) => {
    event.preventDefault();
    try {
      await axios.put(`${serverURL}/api/product/updateData/${id}`, {
        name: editProductName,
        price: editProductPrice,
        category: editProductCategory,
        image: editProductImage,
      });
      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
    setEditProductImage(product.image);
    setEditProductCategory(product.category);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditProductName("");
    setEditProductPrice("");
    setEditProductImage("");
    setEditProductCategory("");
  };

  const deleteProduct = async (id) => {
    try {
      console.log(`Attempting to delete product with id: ${id}`);
      const response = await axios.delete(`${serverURL}/api/product/deleteData/${id}`);
      console.log("Delete response:", response);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="logo">
      <div className="admin-product">
        <button className="UserDetail" onClick={handleUserDetail} > USER DETAILS </button>

        <div className="container">
          <form onSubmit={addProduct} className="product-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Product Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Product Category"
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
              className="input-field"
            />
            <input
              type="url"
              value={newProductImage}
              onChange={(e) => setNewProductImage(e.target.value)}
              placeholder="Add Images..."
              className="input-field"
            />
            <button type="submit" className="add-button">Add Product</button>
          </form>
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                {editingProductId === product._id ? (
                  <form onSubmit={(e) => updateProduct(e, product._id)}>
                    <input
                      type="text"
                      value={editProductName}
                      onChange={(e) => setEditProductName(e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      value={editProductPrice}
                      onChange={(e) => setEditProductPrice(e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="url"
                      value={editProductImage}
                      onChange={(e) => setEditProductImage(e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="text"
                      value={editProductCategory}
                      onChange={(e) => setEditProductCategory(e.target.value)}
                      className="input-field"
                    />
                    <button type="submit" className="update-button">Update</button>
                    <button type="button" onClick={cancelEdit} className="cancel-button">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="product-name">NAME: <b>{product.name}</b></span>
                    <span className="product-category">CATEGORY: <b>{product.category}</b></span>
                    <span className="product-price">PRICE: <b>{product.price}</b></span>
                    <img src={product.image} alt={product.name} height={300} width={300} className="product-image" />
                    <button onClick={() => startEditProduct(product)} className="edit-button">EDIT</button>
                    <button onClick={() => deleteProduct(product._id)} className="delete-button">DELETE</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;





// import React, { useState } from "react";
// import "./Cart.css";
// import { Link } from "react-router-dom";

// export default function Cart({
//   cartItems = [],
//   handleAddToCart,
//   removeFromCart,
// }) {


//   const [quantities, setQuantities] = useState(cartItems.map(() => 1));

//   const handleRemoveFromCart = (itemId) => {
//     removeFromCart(itemId);
//   };

//   const incrementQuantity = (index) => {
//     const newQuantities = [...quantities];
//     newQuantities[index] += 1;
//     setQuantities(newQuantities);
//   };

//   const decrementQuantity = (index) => {
//     if (quantities[index] > 1) {
//       const newQuantities = [...quantities];
//       newQuantities[index] -= 1;
//       setQuantities(newQuantities);
//     }
//   };

//   const CartTotal = () => {
//     let totalAmount = 0;
//     cartItems.forEach((item, index) => {
//       const amount = calculateTotalAmount(item.price, quantities[index]);
//       totalAmount += amount;
//     });
//     return totalAmount;
//   };

//   const calculateTotalAmount = (price, quantity) => {
//     return price * quantity;
//   };

//   return (
//     <div className="Cart">
//       <h1>Your Cart</h1>
//       {cartItems.length > 0 ? (
//         <div>
//           {cartItems.map((item, index) => (
//             <div key={item.id} className="cart-item">
//               <div className="image-container">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   style={{ width: "250px" }}
//                 />
//               </div>
//               <div className="item-details">
//                 <h4 style={{ color: "black" }}>{item.title}</h4>
//                 <p style={{ color: "black" }}>
//                   Price: {calculateTotalAmount(item.price, quantities[index])}
//                 </p>
//                 <div>
//                   <button
//                     className="CartBtn"
//                     onClick={() => decrementQuantity(index)}
//                   >
//                     -
//                   </button>
//                   <h6>Quantity: {quantities[index]} </h6>
//                   <button
//                     className="CartBtn"
//                     onClick={() => incrementQuantity(index)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//               <div>
//                 <Link
//                   className="remove-log"
//                   onClick={() => handleRemoveFromCart(item.id)}
//                 >
//                 </Link>
//               </div>
//             </div>
//           ))}
//           <div>
//             <h3 style={{ color: "black" }}>Total Amout : {CartTotal()}</h3>
//             <button className="CartTotal"> Buy Now !</button>
//           </div>
//         </div>
//       ) : (
//         <p style={{ color: "black" }}>Your Cart is Empty.</p>
//       )}
//     </div>
//   );
// }

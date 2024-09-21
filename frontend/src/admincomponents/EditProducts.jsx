import React, { useState, useEffect } from 'react'
import axios from 'axios';

function EditProducts() {

    //   const [editProductId, setEditProductId] = useState(null);
    const [editProductImage, setEditProductImage] = useState("");
    const [editProductName, setEditProductName] = useState("");
    const [editProductPrice, setEditProductPrice] = useState("");
    const [editProductCategory, setEditProductCategory] = useState('');

    useEffect(() => {
        fetchproducts();
    }, [])

    const fetchproducts = async () => {
        try {
            const response = await axios.get(`${serverURL}/api/products/getproduct`);
            setProducts(response.data.productData);

        } catch (error) {
            console.error('error fetching products: ', error)
        }
    };
    console.log("products", products);

    const updateProduct = async (event, id) => {
        event.preventDefault();
        try {

            await axios.put(`${serverURL}/api/Products/${id}`, {
                image:editProductImage,
                name: editProductName,
                salary: editProductPrice,
                dpt: editProductCategory
            });
            fetchproducts();
            cancelEdit();
        } catch (error) {
            console.error('error updating Products:', error);
        }
    };

    return (
        <div>

        </div>
    )
}

export default EditProducts
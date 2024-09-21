import React, { useState, useEffect } from 'react'
import axios from 'axios';

function AddProducts() {

    const [products, setProducts] = useState([]);
    // const [selectedFile, setSelectedFile] = useState(null);

    const [newProductImg, setNewProductImg] = useState("");
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');

    const serverURL = 'http://localhost:5500'

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
    console.log("products",products);

    const addProduct = async (event) => {
        event.preventDefault();
            try {
            // handleUpload()
            await axios.post(`${serverURL}/api/products/addproduct`, {
                image: newProductImg,
                name: newProductName,
                price: newProductPrice,
                category: newProductCategory
            },

            );
            fetchproducts();
            setNewProductImg('')
            setNewProductName('');
            setNewProductPrice("");
            setNewProductCategory("");
        } catch (error) {
            console.error("error adding Product:", error)
        }
    };

//     const handleUpload = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('image', selectedFile);
//             await axios.post('http://localhost:5555/api/uploadimage', formData, {
//                 headers: {
//                     'content-Type': 'multipart/form-data',
//                 },
//             });
//             alert('Image Uploade successfilly!');
//         } catch (error) {
//             console.error('Image upload failed', error);;
//         }
//     };

    // const handleFileChange = (event) => {
    //     setSelectedFile(event.target.files[0]);
    // };

    return (
        <div>
            AddProducts
            <div>
                <form onSubmit={addProduct}>
                    <input type='url'
                        placeholder='Product Image url'
                        // value={newProductImg}
                        onChange={e=>setNewProductImg(e.target.value)} />

                    <input type="text"
                        placeholder='product Name'
                        value={newProductName}
                        onChange={(e) => { setNewProductName(e.target.value) }}
                    />
                    <input type='number'
                        placeholder='Price'
                        value={newProductPrice}
                        onChange={(e) => { setNewProductPrice(e.target.value) }}
                    />
                    <input type="text"
                        placeholder='Category'
                        value={newProductCategory}
                        onChange={(e) => { setNewProductCategory(e.target.value) }}
                    />

                    <button type='submit' >Add Product</button>
                </form>
            </div>
            <div>
                {
                    products.map((product) =>(
                        <div>
                           <span ><img style={{ width: '100px', height: "100px" }} src={product.image} alt= {product.name}/></span>
                           <span>id : <b>{product._id}</b></span>
                           <span>Name : <b>{product.name}</b></span>
                           <span>Price : <b>{product.price}</b></span>
                           <span>Category : <b>{product.category}</b></span>
                           
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AddProducts
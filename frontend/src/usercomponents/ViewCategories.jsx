import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState,useContext } from 'react'
import { MyContext } from "../Mycontext"
import "./Bata.css";
import axios from 'axios';
// import {
//   MDBCardBody,
//   MDBCardTitle,
//   MDBCardText,
//   MDBCardImage,
// } from "mdb-react-ui-kit";


export default function  ViewCategories() {
  const {products,product,serverURL} = useContext(MyContext)
  // const [filteredProducts,setFilteredProducts] = useState([])
  //const [tableProducts,setTableProducts]=useState([])


  const filteredProducts=products.filter((product)=> product.brand==="Bata")

  const filterproducts = async () => {
    try {
      const response = await axios.post(`${serverURL}/api/products/filterproducts`,{})
    } catch (error) {
      console.error(error)
    }
  }
 

  // console.log("filteredProducts",filteredProducts)
  return (
    <div className="Table-Products">
      <h1>Bata</h1>
      <div className="Table-productsList">
        {
          filteredProducts.filter((item)=>
          item.brand=="Bata"
          ).map((item)=>{
            return(
              <div className= 'itemdisplay'>
                <img src={item.image} alt="" className='imagesdisplay' />
                <h2>{item.name}</h2>
                <h3>category : {item.category}</h3>
                <h3>₹ {item.price}</h3><br />
                {/* <AddToCart /> */}
              </div>
            )
          }   
          )


        // product.filter((product) => (
        //   <Link
        //     to={`/Products/${product.id}`}
        //     key={product.id}
        //     className="linkWithoutDecoration"
        //   >
        //     <div className="Table-cardproduct">
        //       <MDBCardImage
        //         className="Table-ProductsImg"
        //         src={product.image}
        //         position="top"
        //         alt=""
        //       />
        //       <MDBCardBody>
        //         <MDBCardTitle className="Table-ProductsTitle">
        //           {product.name}
        //         </MDBCardTitle>
        //         <MDBCardText className="Table-ProductsCategory">
        //           {product.category}
        //         </MDBCardText>
        //         <MDBCardText className="Table-ProductsPrice">
        //           Price: {product.price}
        //         </MDBCardText>
        //       </MDBCardBody>
        //     </div>
        //   </Link>
        // ))
      }
      </div>
    </div>
  );
}


// {
    
//   filtersearch.filter((item)=>
//       item.brand=="Bata"
//       ).map((item)=>{
//         return(
//           <div className= 'itemdisplay'>
//             <img src={item.image} alt="" className='imagesdisplay' />
//             <h1>{item.name}</h1><br />
//             {/* <h1>Brand : {item.brand}</h1><br /> */}
//             {/* <h1>catagory : {item.catagory}</h1><br /> */}
//             <h1>₹ {item.price}</h1><br />
//             <AddToCart />
//           </div>
//         )
//       }   
//       )
//   }



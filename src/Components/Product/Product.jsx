import React, { useEffect, useState } from "react";
import classes from "./Product.module.css";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "../Loader/Loader";
import { SlMicrophone } from "react-icons/sl";

function Product() {
  const [products, setProducts] = useState();
  const [isLoading, setisLoading] =useState(false)

  useEffect(() => {
    setisLoading(true)
    axios.get("https://fakestoreapi.com/products")
      .then((res) => {

        console.log(res.data); // Debug API response
        setProducts(res.data);
        setisLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setisLoading(false)
      });
  }, []);
 if(!products){
  <div> Loading</div>
 }
  return (
    <>

    {
    isLoading?(<Loader/>) :( <section className={classes.products_container}>
      { 
      products?.map((singleProduct,i)=> {
        return (
          <ProductCard
            renderAdd={true}
            product={singleProduct}
            key={i}
          />
         
        );
      })
        
     }
    </section>)
}
    </>
    
  )
}

export default Product;

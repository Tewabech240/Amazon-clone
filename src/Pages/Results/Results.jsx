import React, {useState, useEffect } from 'react'
import classes from './Results.module.css'
import Layout from '../../Components/Layout/Layout'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { productUrl } from '../../Api/endPoints';
import Product from '../../Components/Product/Product';
import ProductCard from '../../Components/Product/ProductCard';

function Results() {
  const [results, setResults] =useState([]);
  const {categoryName} =useParams()
  useEffect(() => {
 axios
   .get(`${productUrl}/products/category/${categoryName}`)
   .then((res) => {
     setResults(res.data);
   })
   .catch((err) => {
     console.log(err);
   });
   }, [])
 

  return (
    <Layout>
      <section>
        <h1 style={{ padding: "30px" }}>Results</h1>
        <p style={{ padding: "30px" }}> category / {categoryName}</p>
        <hr />
        <div className={classes.products_container}>
          {results?.map((Product) => (
            <ProductCard
              key={Product.id}
              product={Product}
              renderDesc={false}
              renderAdd={true}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default Results


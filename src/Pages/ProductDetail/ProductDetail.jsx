import React, { useEffect, useState } from 'react'
import Layout from '../../Components/Layout/Layout'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { productUrl } from '../../Api/endPoints'
import ProductCard from '../../Components/Product/ProductCard'
import Loader from "../../Components/Loader/Loader"


function ProductDetail() {
  const [product, setProduct] = useState({});
  const [isLoading, setisLoading] = useState(false)
  const {productId} = useParams()
  useEffect(()=>{
    setisLoading(true)
    axios.get ( `${productUrl}/products/${productId}`)
    .then((res)=>{
setProduct(res.data)
setisLoading(false)

    }).catch((err)=>{
      console.log(err);
      setisLoading(false)
    })
  }, [] )

  return (
    <Layout>
      {isLoading? (<Loader/>):(<ProductCard
        product={product}
        flex = {true}
        renderDesc={true}
        renderAdd={true}
      />)}
      
      
    </Layout>
  )
}

export default ProductDetail
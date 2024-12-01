import React,{useContext, useState} from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/Layout/Layout";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import productCard from "../../Components/Product/ProductCard";
import {useStripe, useElements, CardElement} from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";


function Payment () {
  const [{ user, basket}] = useContext(DataContext);
  console.log(user)

   const totalItem = basket?.reduce((amount, item) => {
     return item.amount + amount;
   }, 0);

   const total = basket.reduce((amount, item) => {
     return item.price * item.amount + amount;
   }, 0);

const [cardError, setCardError] = useState(null);
const [processing, setProcessing] = useState(false)

const stripe = useStripe();
const elements = useElements();
const navigate = useNavigate()


const handleChange =(e) => {
  // console.log(e)
  e.error?.message? setCardError( e?.error?.message): setCardError("")
};

const handlePayment = async (e) =>{
  e.preventDefault();


  try {
    setProcessing(true)
// 1.backend || functions ---> contact to the client secret
    const response = await axiosInstance({
     method: "POST",
     url: `/payment/create?total=${total*100}`,
    });

    // console.log(response.data)

    const clientSecret = response.data?.clientSecret;


// 2. client side (react side confirmation) 
const { paymentIntent } = await stripe.confirmCardPayment
(clientSecret, {
Payment_method: {
    card: elements.getElement(CardElement),
  },
  })

  // 3.after the confrmation --> order firestore database BiSave, clear basket

await db
.collection("users")
.doc(user.uid)
.collection("orders")
.doc(paymentIntent.id)
.set({
  basket: basket,
  amount: paymentIntent.amount,
  created: paymentIntent.created,
});

setProcessing(false);
navigate("/orders", {state:{msg:"you have placed new order"}})
  }catch (error) {
    console.log(error)
    setProcessing(false)
  }

}

  return (
    <LayOut>
      {/* header */}
      <div className={classes.Payment__header}>Checkout (totalItem) items</div>
      {/* payment method*/}
      <section className={classes.Payment}>
        {/* 
        address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
        </div>
        <div>abe@gmail.com</div>
        <div>123 React Lane</div>
        <div>Ethiopia</div>
        <hr />
        {/* product */}

        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <productCard product={item} flex={true} />
            ))}
          </div>
        </div>

        <hr />
        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.Payment__card__container}>
            <div className={classes.Payment__details}>


              <form onSubmit={handlePayment}>

                {/* error */}
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}

                {/* card element */}
                <CardElement onChange={handleChange} />

                {/* price */}
                <div className={classes.Payment__price}>
                  <div>
                    <span style={{ display:"flex", gap:"10px" }}>
                      <p> Total Order |</p> <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit">

                    {
                      processing? (
                        <div className={classes.loding}>
                          <ClipLoader color="gray" size={12}/>
                          <p>Please Wait ...</p>
                        </div>

                      ):"pay now"
                    }
                    Pay Now


                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment
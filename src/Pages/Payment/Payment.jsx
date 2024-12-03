import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/Layout/Layout";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";
import { collection, doc, setDoc } from "firebase/firestore"; // Ensure correct Firestore imports

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  console.log(user);

  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  const total = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.error?.message ? setCardError(e.error.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);

      const response = await axiosInstance.post(
        `/payment/create?total=${total * 100}`
      );

      const clientSecret = response.data?.clientSecret;

      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      console.log(paymentIntent);

      const orderData = {
        basket: basket,
        amount: paymentIntent.amount,
        created: paymentIntent.created,
      };

      const userOrdersRef = collection(db, "users", user.uid, "orders");
      const orderDocRef = doc(userOrdersRef, paymentIntent.id);
      await setDoc(orderDocRef, orderData);

      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);
      navigate("/orders", { state: { msg: "You have placed a new order." } });
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.Payment__header}>
        Checkout ({totalItem}) items
      </div>
      <section className={classes.Payment}>
        <div className={classes.flex}>
          <h3>Delivery Address</h3>

          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Ethiopia</div>
          </div>
        </div>
        <hr />
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.Payment__card__container}>
            <div className={classes.Payment__details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                <CardElement onChange={handleChange} />
                <div className={classes.Payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order |</p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing}>
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12} />
                        <p>Please Wait ...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                   
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

export default Payment;

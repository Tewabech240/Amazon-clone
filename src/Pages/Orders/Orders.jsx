import React,{useContext, useState, useEffect} from 'react'
import Layout from '../../Components/Layout/Layout'
import classes from "./Orders.module.css"
import { db } from '../../Utility/firebase';
import { DataContext } from '../../Components/DataProvider/DataProvider';
import ProductCard from '../../Components/Product/ProductCard';
import { collection,query,orderBy,onSnapshot } from 'firebase/firestore';

function Orders  ()  {
  const [{user}, dispatch ] =useContext(DataContext)
  const [ orders, setOrders] = useState([])

  // useEffect(()=> {
  //   if(user){
  //     db.collection("users")
  //     .doc(user.uid)
  //     .collection("orders")
  //     .orderBy("created","desc")
  //     .onSnapshot((snapshot) => {
  //       setOrders(
  //         snapshot.docs.map((doc)=>({
  //        id: doc.id,
  //        data: doc.data(),
  //         }))
  //       );
  //     });
  useEffect(() => {
    if (user) {
      // Reference the orders collection under the specific user
      const userOrdersRef = collection(db, "users", user.uid, "orders");
      // Create a query to order by the "created" field in descending order
      const q = query(userOrdersRef, orderBy("created", "desc"));
      // Listen to the query snapshot
      onSnapshot(q, (snapshot) => {
        console.log(snapshot);
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    } else {
      setOrders([]);
    }
  }, [user]);
console.log(orders)
  return (
    <Layout>
     <section className={classes.container}>
      <div className={classes.orders_container}>
        <h2>Your Orders</h2>

        {orders?.length== 0 && <div style={{ padding: "20px" }}> you don't have orders yet.
          </div>
        }
        {/* orderd items */}
        <div>{
          orders?.map((eachOrder, i)=>{
return (
<div key={i}>
<hr />
<p>Order ID: {eachOrder?.id}</p>
{eachOrder?.data?.basket?.map(order=>(
<ProductCard
flex={true}
product={order}
key={order.id}

/>
          ))}
</div>
  
)

          })

}</div>
      </div>
     </section>
    </Layout>
  );
}

export default Orders;
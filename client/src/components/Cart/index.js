import React, { useEffect, useState } from 'react';
import { NavLink,Link, useSearchParams } from 'react-router-dom';
import { useMutation,useQuery } from '@apollo/client';
import { QUERY_ORDERS} from '../../utils/queries';
import { ADD_ORDER} from '../../utils/mutations';
import { useNavigate } from "react-router-dom";
import Auth from "../../utils/auth";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import Purchase from '../Purchase';
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
function Cart() {
  const[total,setTotal]=useState(0);
  const [getCheckout, { data:data2 }] = useLazyQuery(QUERY_CHECKOUT);
  console.log(data2)
  console.log("check")
  useEffect(() => {
    if (data2) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data2.checkout.session });
      });
    }
  }, [data2]);

  // var profileEmail = Auth.getProfile();
    // var tempEmail =profileEmail.data.email
  const [toggle, setToggle] = useState(false)
  // const { loading, data } = useQuery(QUERY_ORDERS,{
  //   variables:{email:tempEmail}
  // });
  // const orderData = data?.user || [];
  // console.log("orders");
  // console.log(orderData.orders);
  // const[searchparams] =useSearchParams();
  // console.log(searchparams.get("id"));
  let navigate = useNavigate();

  const [addOrder, { error }] = useMutation(ADD_ORDER);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  let sum = 0;
  var sumTotal;
  cart.forEach((item,index)=>{
   sum = sum + item.price;
   sumTotal = Math.round(sum);
  //  setTotal(sum);
  });
  var discount =0;
  if (sumTotal> 50){
   discount = 10
   var totalS = sumTotal-discount;
  }else{
    discount = 0;
    var totalS = sumTotal
  }
  const handleClick = async event => {
    function myFunction(item,index){
      let itemName = JSON.stringify(item.name);
      const { data } = addOrder({variables: {name:itemName,price:item.price}});
    }
    // console.log(data);
    cart.forEach(myFunction);
    localStorage.setItem("cart","[]")
    getCheckout({
      variables: { products: totalS }
    });
    };

    const handleDelete = (name) => {
      let cart = JSON.parse(localStorage.getItem("cart"));
      const result = cart.filter(item=>item.name !== name);
      console.log(result)
      localStorage.setItem("cart", JSON.stringify(result));
      navigate("/cart");
      };
    return(
      <>
<section className='m-5'>
<h1>We've Got You!</h1>
      <h2>Here Are Your Items</h2>
      <table class="table table-hover p-5">
        <thead>
          <tr>
          <th scope="col"></th>
          <th scope="col">Name</th>
            <th scope="col">Price</th>
          </tr>
          </thead>
          <tbody id="cartTableBody">
          {cart.map((items,key) =>(
             
              <tr>
          <th scope="col">{key+1}</th>
          <th scope="col">{items.name}</th>
          <th scope="col">{items.price}</th>
          <th scope="col">
            <button class="btn btn-outline-danger" 
            style={{fontSize:"20px",fontWeight:"700",height:"30px",paddingTop:"0px"}}
             onClick={() => {
              handleDelete(items.name);
            }}
            >x</button></th>
          </tr>
             
          ))}
          <tr>
          <th scope="col"></th>
          <th scope="col">Discount</th>
          <th scope="col"> $ {discount}</th>
          </tr>
          <tr>
          <th scope="col"></th>
          <th scope="col">Total</th>
          <th scope="col"> $ {totalS}</th>
          </tr>
       </tbody>
      </table>
      <Link to="/" className='text-decoration-none text-black'>
      <button type="button" class="btn btn-danger my-2 my-md-0 mx-0 mx-md-3 " 
      style={{width:"280px"}}
      id="continueBrowsing">
        Continue browsing
      </button>
      </Link>
      <button 
      onClick={() => setToggle(!toggle)}
          type="button" class="btn btn-danger my-2 my-md-0 mx-0 mx-md-3" 
          style={{width:"280px"}}
          id="purchasesHistory">
        Purchases history
      </button>
      <button onClick={() => {
            handleClick();
          }}
          type="button" class="btn btn-danger my-2 my-md-0 mx-0 mx-md-3" 
          style={{width:"280px"}}
          id="confirmPurchase">
        Confirm purchase!
      </button>
     { toggle && (<Purchase></Purchase>)}
      
</section>
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTst0bPCetb2YqQwuNRqVpwRTkoLozhhlyKCA&usqp=CAU" class="d-block w-40  p-3 mx-md-3" alt="..."></img>
</>
    )
}

export default Cart;
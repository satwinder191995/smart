import React, { useEffect, useState } from 'react';
import { useMutation,useQuery } from '@apollo/client';
import { QUERY_ORDERS} from '../../utils/queries';
import Auth from "../../utils/auth";
function Purchase(){
    var profileEmail = Auth.getProfile();
    var tempEmail =profileEmail.data.email
    console.log(tempEmail)
    const { loading, data } = useQuery(QUERY_ORDERS,{
        variables:{email:tempEmail}
      });
    const orderData = data?.user.orders || [];
    return(
        <>
        <div id="purchasesDiv">
        <h1 class="mt-5">Purchases history</h1>
        <table class="table table-hover p-5">
          <thead>
            <tr>
            <th scope="col"></th>
            <th scope="col">Title</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          {orderData.map((items,key) =>(
             <tbody id="cartTableBody">
              <tr>
          <th scope="col">{key+1}</th>
          <th scope="col">{items.name}</th>
          <th scope="col">{items.price}</th>
          </tr>
             </tbody>
          ))}
        </table>
      </div>
      </>
    )
}
export default Purchase;